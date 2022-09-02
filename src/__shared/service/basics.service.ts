import { ButtonInteraction, Collection, CommandInteraction, Guild, GuildMember, Interaction, Message, MessageActionRow, MessageButton, MessageEmbed, MessageReaction, Modal, ModalSubmitInteraction, Snowflake, TextChannel, TextInputComponent, User } from "discord.js";
import { readFileSync, writeFileSync } from "fs";
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


export async function checkUserResponse(interaction: ButtonInteraction | CommandInteraction, question: string): Promise<Snowflake | undefined> {
    let answer: string | undefined = await new Promise(async resolve => {
        const modal = new Modal()
            .setTitle("Ticket System")
            .setCustomId(question.trim().replace(/ /g, '').toLocaleLowerCase())
            .addComponents(new MessageActionRow({components: [new TextInputComponent({label: question, customId: "questionAnswer", style: 'SHORT'})]}));

        await interaction.showModal(modal);

        let checkFunction = async (popUpinteraction: ModalSubmitInteraction) => {
            if (popUpinteraction.type != 'MODAL_SUBMIT') return;
            if (popUpinteraction.customId != question.trim().replace(/ /g, '').toLocaleLowerCase()) return;


            resolve(popUpinteraction.fields.getTextInputValue('questionAnswer'));

            supportClient.removeListener("interactionCreate", checkFunction);

            popUpinteraction.reply({
                embeds: [new MessageEmbed({
                    color: '#34ad4c',
                    description: `**✅ The Ticket has been closed by ${interaction.user.username}** \n\n*Solution: ${popUpinteraction.fields.getTextInputValue('questionAnswer')}*`
                })],
                components: [new MessageActionRow({
                    components: [new MessageButton()
                        .setLabel("Delete")
                        .setEmoji("⛔")
                        .setStyle("DANGER")
                        .setCustomId("TicketTooldelBtnTicket")
                    ]
                })]
            });
        };

        supportClient.addListener("interactionCreate", checkFunction);
        setTimeout(() => {
            supportClient.removeListener("interactionCreate", checkFunction);
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
    const guildConfigurations: GuildConfigs = await JSON.parse(readFileSync('./data/guildConfigs.json', "utf-8").toString()),
        guildConfig: GuildConfig = guildConfigurations[guildId];

    if(!guildConfig) guildConfigurations[guildId] = {
        ticketId: 0
    }
    return guildConfig;
}

export async function saveGuildConfig(guildConfig: GuildConfig, guildId: string): Promise<void> {
    let guildConfigurations: GuildConfigs = await JSON.parse(readFileSync('./data/guildConfigs.json', "utf-8").toString());
    guildConfigurations[guildId] = guildConfig;

    writeFileSync('./data/guildConfigs.json', JSON.stringify(guildConfigurations));
}