import { Message, TextChannel } from "discord.js";
import { Command } from "../__shared/models/command.model";
import { replySuccess } from "../__shared/service/notification.service";
import { addUserToTicketChannel } from "../service/ticketTool.service";
import { supportClient } from "../index";
import { Authentication } from "../__shared/models/permissions.model";

export const add: Command = {
    permission: "team",
    requireArgs: true,
    help: "The controlcommand for the ticket system",
    method: async function main(msg: Message, args: string[], perms: Authentication): Promise<void> {
        const userId = await addUserToTicketChannel(msg, args);
        if(!userId) return;

        replySuccess("hinzugefügt", "\n", `<@${userId}>`, msg.channel as TextChannel);
    }
}