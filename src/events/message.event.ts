import { Message, TextChannel } from "discord.js";
import { readFileSync } from "fs";
import { supportClient, supportPrefix } from "../";
import { Command } from "../__shared/models/command.model";
import { GuildConfig, GuildConfigs } from "../__shared/models/guildConfigs.model";
import { Authentication } from "../__shared/models/permissions.model";
import { authenticate } from "../__shared/service/authGuard.service";
import { fetchGuildconfig } from "../__shared/service/basics.service";
import { error, info } from "../__shared/service/logger";
import { replyError } from "../__shared/service/notification.service";

export async function message(msg: Message): Promise<void> {
    if(!msg.member) return;
    if(msg.author.bot) return;
    if(msg.webhookId) return;

    const auth: Authentication = await authenticate(msg.author, msg.member);
    const commandAlasses: {[alias: string]: string} = JSON.parse(readFileSync('./data/commandAliasses.json', "utf-8").toString());
    info(JSON.stringify(auth), "permissions");

    let guildConfig: GuildConfig = await fetchGuildconfig(msg.member.guild.id);

    const prefix = (guildConfig?.prefix) ? guildConfig.prefix : supportPrefix;
    if(!msg.content.startsWith(prefix)) return;


    let commandName = msg.content.split(' ')[0].slice(prefix.length).toLocaleLowerCase();
    const args = msg.content.split(' ').slice(1);


    if(commandAlasses[commandName]) commandName = commandAlasses[commandName];
    let command: Command;
    try {
        command = (await require(`${__dirname}/../commands/${commandName}.command.ts`))[commandName];
    } catch(err) {
        replyError("command_not_found", "-", msg.channel as TextChannel);
        return;
    }
    if(!command) return;

    if(command.permission in auth != true) {
        replyError("Unathorized", "-", msg.channel as TextChannel);
        return;
    }

    if(!args[0] && command.requireArgs) {
        msg.reply(command.help);
    } else {
        try{
            command.method(msg, args, auth);
        } catch(err: any) {
            msg.reply("command broken");
            error(err as string);
        }
    }
}