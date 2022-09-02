import { CommandInteraction, Message } from "discord.js";
import { Command } from "../__shared/models/command.model";
import { createTicketMessage } from "../service/ticketTool.service";
import { Authentication } from "../__shared/models/permissions.model";

export const panel: Command = {
    permission: "manager",
    requireArgs: false,
    help: "The command to create a new ticket panel",
    method: async function main(interaction: CommandInteraction, perms: Authentication): Promise<void> {
        createTicketMessage(interaction, false);
    }
}