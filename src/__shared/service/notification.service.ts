import * as fs from 'fs';
import { Client, CommandInteraction, GuildMember, MessageEmbed, ModalSubmitInteraction, PartialMessage, TextChannel, User, VoiceState } from "discord.js";
import { Setup } from '../models/setup.model';
import { Config } from '../models/config.model';
import { fetchUser } from './basics.service';

const texts = JSON.parse(fs.readFileSync(`${__dirname}/../../../data/text.json`, "utf-8").toString());
const config: Config = JSON.parse(fs.readFileSync(`${__dirname}/../../../config.json`, "utf-8").toString());


export async function adminLog(client: Client, content: string, at: string): Promise<void> {
    const adminLogId = "933109856326520852";
    let adminlogChannel: TextChannel = await client.channels.fetch(adminLogId) as TextChannel;

    let embed = new MessageEmbed()
        .setAuthor(client.user?.username || "unknown")
        .setColor('RED')
        .setDescription(content)
        .addField("Error at:", at);

    adminlogChannel.send({embeds: [embed]});
}

export function replyError(subject: string, reason: string, channel?: TextChannel): void {
    if(!channel) return;
    if(subject == "") subject = "unknown";

    let embed = new MessageEmbed()
        .setColor('#d42828')
        .setDescription(`❌ **${subject.charAt(0).toUpperCase() + subject.slice(1)}** | ${texts[reason]}`);

    channel.send({embeds: [embed]});
}

export async function replySuccess(subject: string, reason: string, name: string, interaction?: CommandInteraction | ModalSubmitInteraction): Promise<boolean> {
    let embed = new MessageEmbed()
        .setColor('#34ad4c')
        .setDescription(`✅ **${name} has been ${subject}**${(reason) ? " | " + reason : ''}`);

    if(!interaction) return false;
    await interaction.reply({embeds: [embed]});

    return true;
}

export function supportNotification(oldState: VoiceState, newState: VoiceState): void {
    const setup: Setup = JSON.parse(fs.readFileSync('./setup.json', "utf-8").toString());
    
    if(newState.channelId == setup.supportChannel.channelId) {
        setup.supportChannel.mentions.forEach(async (roleId: string) => {
            oldState.guild.members.fetch().then(members => {
                const allTrusteds = members.filter(member => member.roles.cache.has(roleId)).map((member: GuildMember) => member);
                
                allTrusteds.forEach((member: GuildMember) => {
                    member.send({embeds: [{
                        title: "Support-Warteraum",
                        color: '#10c982',
                        description: `<@${newState.member?.id}> wartet in <#${setup.supportChannel.channelId}>! Bitte kümmere dich um ihn, wenn du Zeit hast.`,
                    }]}).catch(async (err) => {
                        const owner = await fetchUser(config.ownerID).catch(err => {});
                        if(!owner) return;

                        owner.send({embeds: [new MessageEmbed({
                            title: "⚠Support Notification Error⚠",
                            color: "#FF0000",
                            description: `Unable to notifie <@${member.id}>`
                        })]})
                    });
                });
            });
        });
    }
}
