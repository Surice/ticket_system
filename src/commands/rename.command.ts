import { CommandInteraction, Message, TextChannel } from "discord.js";
import { Command } from "../__shared/models/command.model";
import { Authentication } from "../__shared/models/permissions.model";
import { replySuccess } from "../__shared/service/notification.service";

export const rename: Command = {
    permission: "team",
    requireArgs: false,
    help: "The command to rename the ticket title",
    method: async function main(interaction: CommandInteraction, perms: Authentication): Promise<void> {
        const channel: TextChannel = interaction.channel as TextChannel;
        let channelName = channel.name.split("-");

        await channel.setName(`${interaction.options.getString('name') || "unknown"}-${channelName[channelName.length - 1]}`).catch(console.error);
        replySuccess("changed", interaction.options.getString('name') || "unknown", "The ticket type", interaction);
    }
}