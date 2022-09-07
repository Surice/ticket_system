import { CommandInteraction, MessageEmbed, Role} from "discord.js";
import { readFileSync, writeFileSync } from "fs";
import { supportClient } from "..";
import { Command } from "../__shared/models/command.model";
import { GuildConfigs } from "../__shared/models/guildConfigs.model";
import { Authentication } from "../__shared/models/permissions.model";

export const setup: Command = {
    permission: "manager",
    requireArgs: false,
    help: "The command to setup the bot configuration",
    method: async function main(interaction: CommandInteraction, perms: Authentication): Promise<void> {
        let configs: GuildConfigs = JSON.parse(readFileSync('./data/guildConfigs.json', "utf-8").toString());
        if(interaction.options.getString('dropdown') == "showConfig") {
            const guildConfig = configs[interaction.guildId || ""];

            let embed = new MessageEmbed()
                .setTitle(`${supportClient.user?.username} - Configuration`)
                .setColor("#008bff")
                .setFooter({text: `${interaction.guild?.name} x ${supportClient.user?.username}`,
                iconURL: supportClient.user?.displayAvatarURL()});

            embed.addFields([{
                name: "Log Channel", value: `<#${guildConfig.log}>` || "-none-", inline: true
            },{
                name: "Ticket Categorie", value: `<#${guildConfig.categorieId}>` || "-none", inline: true
            },{name: "\u200b", value: "\u200b"},{
                name: "Manager Roles", value: `${guildConfig.managerRoles?.map(id => `<@&${id}>`)}` || "-none-", inline: true
            },{
                name: "Supporter Roles", value: `${guildConfig.teamRoles?.map(id => `<@&${id}>`)}` || "-none-", inline: true
            }]);

            interaction.reply({embeds: [embed]});
        }else {
            configs[interaction.guildId || ""] = {
                ticketId: 0
            }

            if(interaction.options.getChannel('channel')) configs[interaction.guildId || ""].log = interaction.options.getChannel('channel')?.id;
            if(interaction.options.getChannel('categorie')) configs[interaction.guildId || ""].categorieId = interaction.options.getChannel('categorie')?.id;
            if(interaction.options.getMentionable('manager')) {
                if(!configs[interaction.guildId || ""].managerRoles?.includes((interaction.options.getMentionable('manager') as Role).id)) configs[interaction.guildId || ""].managerRoles?.push((interaction.options.getMentionable('manager') as Role).id);
                else  return;
            }

            configs[interaction.guildId || ""] = {
                ticketId: 0
            }

            writeFileSync('./data/guildConfigs.json', JSON.stringify(configs));
        }
    }
}