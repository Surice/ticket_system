import { Message, TextChannel } from "discord.js";
import { readFileSync, writeFileSync } from "fs";
import { Command } from "../__shared/models/command.model";
import { GuildConfigs } from "../__shared/models/guildConfigs.model";
import { Authentication } from "../__shared/models/permissions.model";
import { checkUserResponse } from "../__shared/service/response.service";

export const setup: Command = {
    permission: "manager",
    requireArgs: false,
    help: "The command to setup the bot configuration",
    method: async function main(msg: Message, args: string[], perms: Authentication): Promise<void> {
        let configs: GuildConfigs = JSON.parse(readFileSync('./data/guildConfigs.json', "utf-8").toString());

        let categorieId = await checkUserResponse(msg.channel as TextChannel, msg.author.id, {title: "Configure Ticket categorie", description: "Please paste the categorie ID here"}),
            logChannel = await checkUserResponse(msg.channel as TextChannel, msg.author.id, {title: "Configure ticket log", description: "Please paste the chanenl log ID here"}, "channel");

        if(!categorieId || !logChannel) {
            msg.reply("Setup failed!");
            return;
        }

        configs[msg.guildId || ""] = {
            categorieId: categorieId,
            log: logChannel,
            managerRoles: [],
            teamRoles: [],
            ticketId: 0
        }

        writeFileSync('./data/guildConfigs.json', JSON.stringify(configs));
    }
}