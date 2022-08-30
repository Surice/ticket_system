import { Message, TextChannel } from "discord.js";
import { Command } from "../__shared/models/command.model";
import { Authentication } from "../__shared/models/permissions.model";
import { deleteTicketChannel } from "../service/ticketTool.service";

export const remove: Command = {
    permission: "team",
    requireArgs: false,
    help: "The Command to delete the ticket",
    method: async function main(msg: Message, args: string[], perms: Authentication): Promise<void> {
        deleteTicketChannel(msg.channel as TextChannel, perms, msg.author.tag);
    }
}