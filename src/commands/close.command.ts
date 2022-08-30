import { Message, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import { Command } from "../__shared/models/command.model";
import { Authentication } from "../__shared/models/permissions.model";
import { replySuccess } from "../__shared/service/notification.service";
import { closeTicketChannel } from "../service/ticketTool.service";
import { supportClient } from "../index";

export const close: Command = {
    permission: "team",
    requireArgs: false,
    help: "Command to close the ticket",
    method: async function main(msg: Message, args: string[], perms: Authentication): Promise<void> {
        const close = await closeTicketChannel(msg.channel as TextChannel, perms, msg.member?.displayName || "undefined", msg.reply);

        if (!close) {
            replySuccess(`has been signed as finished by ${msg.member?.displayName}!`, "\n\n*Please wait for a team member who will close the ticket*", "Ticket", msg.channel as TextChannel).then(message => {
                message?.edit({
                    embeds: message.embeds,
                    components: [new MessageActionRow({
                        components: [new MessageButton()
                            .setLabel("Close")
                            .setEmoji("🔒")
                            .setStyle("SUCCESS")
                            .setCustomId("TicketToolcloseBtnTicket")
                        ]
                    })]
                })
            });

            let channelName = (msg.channel as TextChannel).name.split("-");

            await (msg.channel as TextChannel).setName(`finished-${channelName[channelName.length - 1]}`).catch(console.error);
            return;
        }

        msg.reply({
            embeds: [new MessageEmbed({
                color: '#34ad4c',
                description: `**✅ The Ticket has been closed by ${msg.member?.displayName}**`
            })],
            components: [new MessageActionRow({
                components: [new MessageButton()
                    .setLabel("Delete")
                    .setEmoji("⛔")
                    .setStyle("DANGER")
                    .setCustomId("TicketTooldelBtnTicket")
                ]
            })]
        })
    }
}