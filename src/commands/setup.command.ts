import { CommandInteraction, MessageEmbed, Role} from "discord.js";
import { readFileSync, writeFileSync } from "fs";
import { supportClient } from "..";
import { Command } from "../__shared/models/command.model";
import { GuildConfig, GuildConfigs } from "../__shared/models/guildConfigs.model";
import { Authentication } from "../__shared/models/permissions.model";
import { info } from "../__shared/service/logger";

export const setup: Command = {
    permission: "manager",
    requireArgs: false,
    help: "The command to setup the bot configuration",
    method: async function main(interaction: CommandInteraction, perms: Authentication): Promise<void> {
        let configs: GuildConfigs = JSON.parse(readFileSync(`${__dirname}/../../data/guildConfigs.json`, "utf-8").toString());
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
            let updates: string = "";
            if(!configs[interaction.guildId as string]) configs[interaction.guildId as string] = {
                ticketId: 0
            }
            let gc: GuildConfig = configs[interaction.guildId as string];

            console.log(interaction.options);

            if(interaction.options.getChannel('log_channel')){
                gc.log = interaction.options.getChannel('log_channel')?.id;
                updates += " Log-Channel,";
            }
            if(interaction.options.getChannel('ticket_categorie')) {
                gc.categorieId = interaction.options.getChannel('ticket_categorie')?.id;
                updates += " Ticket-Categorie,";
            }
            if(interaction.options.getMentionable('manager_roles')) {
                let managerRole = interaction.options.getMentionable('manager_roles') as Role;

                if(!gc.managerRoles) gc.managerRoles = new Array();

                info(`${gc.managerRoles?.includes(managerRole.id)}`, "role id check");

                if(!gc.managerRoles?.includes(managerRole.id)) gc.managerRoles?.push(managerRole.id);
                else  gc.managerRoles.splice(gc.managerRoles.indexOf(managerRole.id), 1);

                updates += " Manager-Roles,";
            }
            if(interaction.options.getMentionable('supporter_roles')) {
                let supporterRole = interaction.options.getMentionable('supporter_roles') as Role;

                if(!gc.teamRoles) gc.teamRoles = new Array();

                if(!gc.teamRoles?.includes(supporterRole.id)) gc.teamRoles?.push(supporterRole.id);
                else  gc.teamRoles.splice(gc.teamRoles.indexOf(supporterRole.id), 1);

                updates += " Supporter-Roles,";
            }

            writeFileSync(`/data/guildConfigs.json`, JSON.stringify(configs));

            interaction.reply(`Successfully updatet${updates}!`);
        }
    }
}