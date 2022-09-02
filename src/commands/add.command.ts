import { CommandInteraction, Message, TextChannel } from "discord.js";
import { Command } from "../__shared/models/command.model";
import { replySuccess } from "../__shared/service/notification.service";
import { addUserToTicketChannel } from "../service/ticketTool.service";
import { supportClient } from "../index";
import { Authentication } from "../__shared/models/permissions.model";

export const add: Command = {
    permission: "team",
    requireArgs: true,
    help: "Command to add an user to the ticket",
    method: async function main(interaction: CommandInteraction, perms: Authentication): Promise<void> {
        const userId = await addUserToTicketChannel(interaction);
        if(!userId) return;

        replySuccess("has been added", "\n", `<@${userId}>`, interaction);
    }
}