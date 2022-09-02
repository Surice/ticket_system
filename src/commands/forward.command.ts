import { CommandInteraction, Message, MessageEmbed, TextChannel, User } from "discord.js";
import { Command } from "../__shared/models/command.model";
import { replyError, replySuccess } from "../__shared/service/notification.service";
import { Authentication } from "../__shared/models/permissions.model";

export const forward: Command = {
    permission: "team",
    requireArgs: true,
    help: "Command to forward a ticket to another team member",
    method: async function main(interaction: CommandInteraction, perms: Authentication): Promise<void> {
        let user: User | null = interaction.options.getUser('user');

        if (!user) {
            replyError("unknown", "member_not_found", interaction.channel as TextChannel);

            return
        }

        await user.send({embeds: [new MessageEmbed({
            title: "A Support-Ticket was forwarded to you",
            description: `please pay attention on Ticket <#${interaction.channelId}>(${(interaction.channel as TextChannel).name})`,
            fields: [{name: "User", value: `<@${(interaction.channel as TextChannel).topic}>`},{name: "Forwarded by", value: interaction.user.tag}]
        })]});

        replySuccess(`has been forwarded to <@${user.id}>`, "\n", `The ticket`, interaction);
    }
}