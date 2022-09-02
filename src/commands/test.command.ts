import { CommandInteraction } from "discord.js";
import { Command } from "../__shared/models/command.model";
import { Authentication } from "../__shared/models/permissions.model";

export const test: Command = {
    permission: "manager",
    requireArgs: false,
    help: "The Test command",
    method: async function main(interaction: CommandInteraction, args: string[], perms: Authentication): Promise<void> {
        console.log(interaction.options.getUser('user'));
        interaction.deferReply();
        // interaction.reply({content: JSON.stringify(interaction)});
    }
}