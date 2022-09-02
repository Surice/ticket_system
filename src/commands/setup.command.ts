import { CommandInteraction, Message, TextChannel } from "discord.js";
import { readFileSync, writeFileSync } from "fs";
import { Command } from "../__shared/models/command.model";
import { GuildConfigs } from "../__shared/models/guildConfigs.model";
import { Authentication } from "../__shared/models/permissions.model";
import { checkUserResponse } from "../__shared/service/basics.service";

export const setup: Command = {
    permission: "manager",
    requireArgs: false,
    help: "The command to setup the bot configuration",
    method: async function main(interaction: CommandInteraction, perms: Authentication): Promise<void> {
        let configs: GuildConfigs = JSON.parse(readFileSync('./data/guildConfigs.json', "utf-8").toString());

        let categorieId = interaction.options.getChannel('categorie')?.id,
            logChannel = interaction.options.getChannel('channel')?.id;

        if(!categorieId || !logChannel) {
            interaction.reply("Setup failed!");
            return;
        }

        configs[interaction.guildId || ""] = {
            categorieId: categorieId,
            log: logChannel,
            managerRoles: [],
            teamRoles: [],
            ticketId: 0
        }

        writeFileSync('./data/guildConfigs.json', JSON.stringify(configs));
    }
}