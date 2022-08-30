import { Message, MessageEmbed, TextChannel, User } from "discord.js";
import { Command } from "../__shared/models/command.model";
import { replyError, replySuccess } from "../__shared/service/notification.service";
import { supportClient } from "../index";
import { Authentication } from "../__shared/models/permissions.model";

export const forward: Command = {
    permission: "team",
    requireArgs: true,
    help: "Command to forward a ticket to another team member",
    method: async function main(msg: Message, args: string[], perms: Authentication): Promise<void> {
        if(!msg.channel) return;

        let user: User | undefined;

        try {
            user = (msg.mentions.users?.first()) ? msg.mentions.users?.first() : (args[0]) ? await supportClient.users.fetch(args[0]) : msg.author;
        } catch (err) { }

        if (!user) {
            replyError(args[0][0].toUpperCase() + args[0].substring(1), "member_not_found", msg.channel as TextChannel);

            return
        }

        await user.send({embeds: [new MessageEmbed({
            title: "A Support-Ticket was forwarded to you",
            description: `please pay attention on Ticket <#${msg.channelId}>(${(msg.channel as TextChannel).name})`,
            fields: [{name: "User", value: `<@${(msg.channel as TextChannel).topic}>`},{name: "Forwarded by", value: msg.author.tag}]
        })]});

        replySuccess(`has been forwarded to <@${user.id}>`, "\n", `The ticket`, msg.channel as TextChannel);
    }
}