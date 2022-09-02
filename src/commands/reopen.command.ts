import { CommandInteraction, Message, MessageEmbed, TextChannel } from "discord.js";
import { Command } from "../__shared/models/command.model";
import { Authentication } from "../__shared/models/permissions.model";
import { repoenTicketChat } from "../service/ticketTool.service";

export const reopen: Command = {
    permission: "team",
    requireArgs: false,
    help: "The command to reopen a ticket",
    method: async function main(interaction: CommandInteraction, perms: Authentication): Promise<void> {
        const reopened = await repoenTicketChat(interaction.channel as TextChannel, perms, interaction.user.tag);
        if(!reopened) return;

        interaction.reply({
            embeds: [new MessageEmbed({
                color: '#34ad4c',
                description: `**✅ The ticket has been reopened by ${interaction.user.username}**`
            })]
        })
    }
}