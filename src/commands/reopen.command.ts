import { Message, MessageEmbed, TextChannel } from "discord.js";
import { Command } from "../__shared/models/command.model";
import { Authentication } from "../__shared/models/permissions.model";
import { repoenTicketChat } from "../service/ticketTool.service";

export const reopen: Command = {
    permission: "team",
    requireArgs: false,
    help: "The controlcommand for the ticket system",
    method: async function main(msg: Message, args: string[], perms: Authentication): Promise<void> {
        const reopened = await repoenTicketChat(msg.channel as TextChannel, perms, msg.author.tag);
        if(!reopened) return;

        msg.reply({
            embeds: [new MessageEmbed({
                color: '#34ad4c',
                description: `**✅ Ticket wurde von ${msg.member?.displayName} erneut geöffnet**`
            })]
        })
    }
}