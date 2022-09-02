import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from "discord.js";
import { Command } from "../__shared/models/command.model";
import { Authentication } from "../__shared/models/permissions.model";
import { replySuccess } from "../__shared/service/notification.service";
import { closeTicketChannel } from "../service/ticketTool.service";
import { checkUserResponse } from "../__shared/service/basics.service";

export const close: Command = {
    permission: "team",
    requireArgs: false,
    help: "Command to close the ticket",
    method: async function main(interaction: CommandInteraction, perms: Authentication): Promise<void> {
        let solution: string = "",
            dropdown_used = false;
        if(interaction.options.getString('solution')) solution = interaction.options.getString('solution') || "";
        else {
            dropdown_used = true;
            solution = await checkUserResponse(interaction, "Please insert Ticket Solution") || "";
        }
        
        const close = await closeTicketChannel(interaction.channel as TextChannel, perms, interaction.user.username, undefined, solution);

        if (!close) {
            replySuccess(`has been signed as finished by ${interaction.user.username}!`, "\n\n*Please wait for a team member who will close the ticket*", "Ticket", interaction).then(message => {
                message?.edit({
                    embeds: message.embeds,
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

        if(dropdown_used) return;

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
        });
    }
}