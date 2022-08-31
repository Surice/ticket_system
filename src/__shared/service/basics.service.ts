import { Collection, Guild, GuildMember, Message, MessageEmbed, MessageMentions, MessageReaction, Snowflake, TextChannel, User } from "discord.js";
import { readFileSync } from "fs";
import { supportClient } from "../..";
import { GuildConfig, GuildConfigs } from "../models/guildConfigs.model";
import { error } from "./logger";
import { replyError } from "./notification.service";

export async function fetchUser(userId: string): Promise<User> {
    const user: User | void = await supportClient.users.fetch(userId).catch(error => {
        error("cannot Fetch User" + userId);
    });;
    return user as User;
}

export async function fetchMember(memberId: string, guild: Guild, mentions?: Collection<string, GuildMember>): Promise<GuildMember | undefined> {
    let member: GuildMember | void;

    if (mentions?.first()) member = mentions.first();
    else {
        member = await guild.members.fetch(memberId).catch(err => {
            error("cannot Fetch User" + memberId);
        });
    }


    if (!member) return;


    return member;
}


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
                value: `React with ✅ to confirm the request.`,
                inline: true
            }, {
                name: "Decline ❌",
                value: `React with ❌ to cacel the process`,
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

export async function fetchGuildconfig(guildId: string): Promise<GuildConfig> {
    const guildConfigurations: GuildConfigs = JSON.parse(readFileSync('./data/guildConfigs.json', "utf-8").toString()),
        guildConfig: GuildConfig = guildConfigurations[guildId];

    if(!guildConfig) guildConfigurations[guildId] = {
        ticketId: 0
    }
    return guildConfig;
}