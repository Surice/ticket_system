import { Message, TextChannel } from "discord.js";
import { Command } from "../__shared/models/command.model";
import { Authentication } from "../__shared/models/permissions.model";
import { replySuccess } from "../__shared/service/notification.service";
import { supportClient } from "../index";

export const rename: Command = {
    permission: "team",
    requireArgs: false,
    help: "The command to rename the ticket title",
    method: async function main(msg: Message, args: string[], perms: Authentication): Promise<void> {
        const channel: TextChannel = msg.channel as TextChannel;
        let channelName = channel.name.split("-");

        await channel.setName(`${args.join("-")}-${channelName[channelName.length - 1]}`).catch(console.error);
        replySuccess("changed", args.join("-"), "The ticket type", msg.channel as TextChannel);
    }
}