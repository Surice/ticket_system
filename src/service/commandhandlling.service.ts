import { CommandInteraction, GuildMember, TextChannel } from "discord.js";
import { readFileSync } from "fs";
import { Command } from "../__shared/models/command.model";
import { Authentication } from "../__shared/models/permissions.model";
import { authenticate } from "../__shared/service/authGuard.service";
import { error } from "../__shared/service/logger";
import { replyError } from "../__shared/service/notification.service";

export async function handeCommand(interaction: CommandInteraction): Promise<void> {
    if(!interaction.inGuild()) return;

    const auth: Authentication = await authenticate(interaction.user, interaction.member as GuildMember);
    const commandAlasses: {[alias: string]: string} = JSON.parse(readFileSync('./data/commandAliasses.json', "utf-8").toString());

    const commandName = (commandAlasses[interaction.commandName]) ? commandAlasses[interaction.commandName] : interaction.commandName;

    let command: Command;
    try {
        command = (await require(`${__dirname}/../commands/${commandName}.command`))[commandName];
    } catch(err) {
        replyError("command_not_found", "-", interaction.channel as TextChannel);
        return;
    }
    if(!command) return;

    if(command.permission in auth != true) {
        replyError("Unathorized", "-", interaction.channel as TextChannel);
        return;
    }

    if(!interaction.options.data && command.requireArgs) {
        interaction.reply(command.help);
    } else {
        try{
            command.method(interaction, interaction.options.data, auth);
        } catch(err: any) {
            interaction.reply({content: "command broken", ephemeral: true});
            error(err as string);
        }
    }
}