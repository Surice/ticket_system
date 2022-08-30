import { TextChannel, User, Snowflake, Message, MessageReaction, MessageEmbed } from "discord.js";
import { supportClient } from "../..";
import { replyError } from "./notification.service";

export async function checkUserResponse(channel: TextChannel, operator: string, embedData: { title: string, description: string }, checkFor?: string): Promise<Snowflake | undefined> {
    let answer: string | undefined = await new Promise(async resolve => {
        let botMessage = await channel.send({
            embeds: [new MessageEmbed({
                color: "ORANGE",
                title: embedData.title,
                description: embedData.description
            })]
        });

        let checkFunction = async (answerMsg: Message) => {
            if (answerMsg.channel.id != channel.id) return;
            if (answerMsg.author.id != operator) return;

            if (checkFor) {
                switch (checkFor) {
                    case "member":
                        const checkMember = await answerMsg.guild?.members.fetch(answerMsg.content as Snowflake).catch(err => {});

                        if (!checkMember) {
                            replyError(embedData.title, "invalid_channel", undefined);
                            return
                        };
                        break;

                    case "channel":
                        const checkChannel = await supportClient.channels.fetch(answerMsg.content).catch(err => {});

                        if(!checkChannel) {
                            replyError(embedData.title, "invalid_channel", undefined);
                            return
                        }
                    default:
                        break;
                }
            }


            resolve(answerMsg.content);

            botMessage.delete();
            answerMsg.delete();

            supportClient.removeListener("messageCreate", checkFunction);
        };

        supportClient.addListener("messageCreate", checkFunction);
        setTimeout(() => {
            supportClient.removeListener("messageCreate", checkFunction);
            resolve(undefined);
        }, 60000);
    });

    return answer as Snowflake;
}

export async function checkConfirmResponse(channel: TextChannel, author: User, question: string): Promise<boolean> {
    const botMessage = await channel.send({
        embeds: [new MessageEmbed({
            color: "ORANGE",
            title: "Confirm",
            description: question,
            fields: [{
                name: "Confirm ✅",
                value: `Reagiere mit ✅ um die Angaben zu bestätigen.`,
                inline: true
            }, {
                name: "Decline ❌",
                value: `Reagiere mit ❌ um den Vorgang abzubrechen`,
                inline: true
            }]
        })]
    });

    const state: boolean = await new Promise(async (resolve) => {
        await botMessage.react("✅");
        await botMessage.react("❌");

        let reactListener = (reaction: MessageReaction, user: User) => {
            if (reaction.message.id != botMessage.id) return;
            if (user.id != author.id) return;

            if (reaction.emoji.name == "✅" && reaction.count as number >= 2) {
                resolve(true);
                supportClient.removeListener("messageReactionAdd", reactListener);
                return
            }
            if (reaction.emoji.name == "❌" && reaction.count as number >= 2) {
                resolve(false);
                supportClient.removeListener("messageReactionAdd", reactListener);
                return
            }
        }
        supportClient.addListener("messageReactionAdd", reactListener);

        setTimeout(() => {
            supportClient.removeListener("messageReactionAdd", reactListener);
            resolve(false);
        }, 30000);
    });

    botMessage.delete();
    return state;
}