import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed, ModalSubmitInteraction, TextChannel } from "discord.js";
import { Command } from "../__shared/models/command.model";
import { Authentication } from "../__shared/models/permissions.model";
import { replySuccess } from "../__shared/service/notification.service";
import { closeTicketChannel } from "../service/ticketTool.service";
import { checkUserResponse } from "../__shared/service/basics.service";
import { error, info } from "../__shared/service/logger";

export const close: Command = {
    permission: "team",
    requireArgs: false,
    help: "Command to close the ticket",
    method: async function main(interaction: CommandInteraction | ModalSubmitInteraction, perms: Authentication): Promise<void> {
        let solution: string = "";
        
        if((interaction as CommandInteraction).options.getString('solution')) solution = (interaction as CommandInteraction).options.getString('solution') || "";
        else {
            let response: {text: string, component: ModalSubmitInteraction} | undefined = await checkUserResponse(interaction as CommandInteraction, "Please insert Ticket Solution");
            if(!response) return;
            solution = response.text;
            interaction = response.component;
        }
        
        const close = await closeTicketChannel(interaction.channel as TextChannel, perms, interaction.user.username, undefined, solution);

        if (!close) {
            replySuccess(`has been signed as finished by ${interaction.user.username}!`, "\n\n*Please wait for a team member who will close the ticket*", "Ticket", interaction).then(message => {
                if(!message) return;

                interaction.editReply({
                    components: [new MessageActionRow({
                        components: [new MessageButton()
                            .setLabel("Close")
                            .setEmoji("🔒")
                            .setStyle("SUCCESS")
                            .setCustomId("TicketToolcloseBtnTicket")
                        ]
                    })]
                })
            });

            let channelName = (interaction.channel as TextChannel).name.split("-");

            await (interaction.channel as TextChannel).setName(`finished-${channelName[channelName.length - 1]}`).catch(console.error);
            return;
        }
        interaction.reply({
            embeds: [new MessageEmbed({
                color: '#34ad4c',
                description: `**✅ The Ticket has been closed by ${interaction.user.username}** \n\n*Solution: ${solution}*`
            })],
            components: [new MessageActionRow({
                components: [new MessageButton()
                    .setLabel("Delete")
                    .setEmoji("⛔")
                    .setStyle("DANGER")
                    .setCustomId("TicketTooldelBtnTicket")
                ]
            })]
        }).catch(err => error(err, "reply to ticket close"));
    }
}