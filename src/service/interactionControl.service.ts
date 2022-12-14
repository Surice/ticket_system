import {
  GuildMember,
  Interaction,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import { authenticate } from "../__shared/service/authGuard.service";
import {
  closeTicketChannel,
  createTicketChannel,
  deleteTicketChannel,
} from "./ticketTool.service";
import { checkUserResponse } from "../__shared/service/basics.service";
import { error, info } from "../__shared/service/logger";

let selectedData: { [userId: string]: string } = {};

export async function handleInteractionInput(
  interaction: Interaction
): Promise<void> {
  if (interaction.isSelectMenu()) {
    saveSelectData(interaction);
    return;
  }
  if (!interaction.isButton()) return;
  interaction.customId = interaction.customId.substr(10);

  switch (interaction.customId) {
    case "Open":
      const ticketChannelId = await createTicketChannel(
        "none",
        interaction.member as GuildMember
      );

      interaction.reply({
        content: `The ticket channel <#${ticketChannelId}> has been created for you!`,
        ephemeral: true,
        components: [
            new MessageActionRow({
                components: [
                  new MessageButton()
                    .setLabel("Take me there")
                    .setEmoji("💌")
                    .setStyle("LINK")
                    .setURL(`https://discord.com/channels/${interaction.guildId}/${ticketChannelId}`)
                ],
              }),
        ],
      });
      break;

    case "closeBtnTicket":
    case "closeBtnTicketConfirm":
      const perms =  await authenticate(interaction.user, interaction.member as GuildMember);
      let response = await checkUserResponse(interaction, "Please insert Ticket Solution");
      if(!response) return;
    
      info(JSON.stringify(perms), "close tck");
      const close = await closeTicketChannel(interaction.channel as TextChannel, perms, interaction.user.username, interaction.reply, response.text || "unknown");

      if (!close) {
        if (interaction.customId == "closeBtnTicketConfirm") {
          response.component.reply({
            embeds: [
              new MessageEmbed({
                color: "#ff0000",
                description: `❌You are not allowed to close Tickets!❌ \n\nPlease wait until a team member who will close the ticket`,
              }),
            ],
          });
          return;
        }

        response.component.reply({
          embeds: [
            new MessageEmbed({
              color: "#34ad4c",
              description: `**✅The Ticket has been signed as finished by ${interaction.user.username}!** \n\n*Please wait for a team member who will close the ticket*`,
            }),
          ],
          components: [
            new MessageActionRow({
              components: [
                new MessageButton()
                  .setLabel("Confirm Close")
                  .setEmoji("🔒")
                  .setStyle("SUCCESS")
                  .setCustomId("TicketToolcloseBtnTicketConfirm"),
              ],
            }),
          ],
        }).catch(err => error(err, "send reply"));

        let channelName = (interaction.channel as TextChannel).name.split("-");

        await (interaction.channel as TextChannel)
          .setName(`finished-${channelName[channelName.length - 1]}`)
          .catch((err) => {
            interaction.reply({ content: err });
          });
        return;
      }

      response.component.reply({
        embeds: [new MessageEmbed({
            color: '#34ad4c',
            description: `**✅ The Ticket has been closed by ${interaction.user.username}** \n\n*Solution: ${response.text}*`
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
      break;

    case "delBtnTicket":
      deleteTicketChannel(
        interaction.channel as TextChannel,
        await authenticate(interaction.user, interaction.member as GuildMember),
        interaction.user.tag
      );
      break;

    //   ALT für Dropdown
    case "Submit":
      // if (!interaction.member) return;
      // const channelId = await createTicketChannel(
      //   selectedData[interaction.user.id]
      //     ? selectedData[interaction.user.id]
      //     : "none",
      //   interaction.member as GuildMember
      // );

      // if (!channelId) {
      //   interaction.reply({
      //     content:
      //       "Du musst erst einen Grund auswählen, bevor du ein Ticket öffnen kannst!",
      //     ephemeral: true,
      //   });

      //   return;
      // }

      // interaction.reply({
      //   content: `Ticket <#${channelId}> wurde für dich erstellt!`,
      //   ephemeral: true,
      // });

      // delete selectedData[interaction.user.id];
      break;
  }
}

export async function saveSelectData(interaction: Interaction): Promise<void> {
  if (!interaction.isSelectMenu()) return;

  selectedData[interaction.user.id] = interaction.values[0];
  interaction.deferUpdate();
}
