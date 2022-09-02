import { CommandInteraction, Message, TextChannel } from "discord.js";
import { Command } from "../__shared/models/command.model";
import { Authentication } from "../__shared/models/permissions.model";
import { deleteTicketChannel } from "../service/ticketTool.service";

export const remove: Command = {
    permission: "team",
    requireArgs: false,
    help: "The Command to delete the ticket",
    method: async function main(interaction: CommandInteraction, perms: Authentication): Promise<void> {
        deleteTicketChannel(interaction.channel as TextChannel, perms, interaction.user.tag);
    }
}