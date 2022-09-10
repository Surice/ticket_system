import { ButtonInteraction, Collection, CommandInteraction, Guild, GuildMember, MessageActionRow, MessageButton, MessageEmbed, MessageReaction, Modal, ModalSubmitInteraction, Snowflake, TextChannel, TextInputComponent, User } from "discord.js";
import { readFileSync, writeFileSync } from "fs";
import { supportClient } from "../..";
import { GuildConfig, GuildConfigs } from "../models/guildConfigs.model";
import { error } from "./logger";

export async function fetchUser(userId: string): Promise<User> {
    const user: User | void = await supportClient.users.fetch(userId).catch(error => {
        error("cannot Fetch User" + userId);
    });

    return user as User;
}

export async function checkUserResponse(interaction: ButtonInteraction | CommandInteraction, question: string): Promise<{text: string, component: ModalSubmitInteraction} | undefined> {
    let answer: {text: string, component: ModalSubmitInteraction} | undefined = await new Promise(async resolve => {
        const modal = new Modal()
            .setTitle("Ticket System")
            .setCustomId(question.trim().replace(/ /g, '').toLocaleLowerCase())
            .addComponents(new MessageActionRow({components: [new TextInputComponent({label: question, customId: "questionAnswer", style: 'SHORT'})]}));

        await interaction.showModal(modal);

        let checkFunction = async (popUpInteraction: ModalSubmitInteraction) => {
            if (popUpInteraction.type != 'MODAL_SUBMIT') return;
            if (popUpInteraction.customId != question.trim().replace(/ /g, '').toLocaleLowerCase()) return;


            resolve({text: popUpInteraction.fields.getTextInputValue('questionAnswer'), component: popUpInteraction});
            supportClient.removeListener("interactionCreate", checkFunction);
        };

        supportClient.addListener("interactionCreate", checkFunction);
        setTimeout(() => {
            supportClient.removeListener("interactionCreate", checkFunction);
            resolve(undefined);
        }, 60000);
    });
    return answer;
}


export async function fetchGuildconfig(guildId: string): Promise<GuildConfig> {
    const guildConfigurations: GuildConfigs = await JSON.parse(readFileSync('./data/guildConfigs.json', "utf-8").toString()),
        guildConfig: GuildConfig = guildConfigurations[guildId];

    if(!guildConfig) guildConfigurations[guildId] = {
        ticketId: 0
    }
    return guildConfig;
}
export async function saveGuildConfig(guildConfig: GuildConfig, guildId: string): Promise<void> {
    let guildConfigurations: GuildConfigs = await JSON.parse(readFileSync('./data/guildConfigs.json', "utf-8").toString());
    guildConfigurations[guildId] = guildConfig;

    writeFileSync('./data/guildConfigs.json', JSON.stringify(guildConfigurations));
}