import {
  CommandInteraction,
  GuildMember,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
  User,
} from "discord.js";
import { adminLog, replyError } from "../__shared/service/notification.service";
import { construcSaveHead, generateSaveBody } from "./ticketSave.service";
import { supportClient } from "../index";
import { error, info } from "../__shared/service/logger";
import { readFileSync, unlinkSync, writeFileSync } from "fs";
import {
  GuildConfig,
  GuildConfigs,
} from "../__shared/models/guildConfigs.model";
import { Authentication } from "../__shared/models/permissions.model";

export async function createTicketMessage(
  msg: Message,
  content: string[],
  categories: boolean
): Promise<void> {
  let channel: TextChannel = msg.mentions.channels.first() as TextChannel;

  if (!channel) {
    try {
      channel = (await supportClient.channels.fetch(content[1])) as TextChannel;
    } catch (err) {}
  }
  if (!channel) {
    channel = msg.channel as TextChannel;
  }

  const setup: GuildConfigs = await JSON.parse(
      readFileSync("./data/guildConfigs.json", "utf-8").toString()
    ),
    guildConfig: GuildConfig = setup[msg.member?.guild.id || ""];

  const embed = new MessageEmbed()
    .setColor("#EA4630")
    .setTitle("Welcome to the Ticket Support!")
    .setDescription(
      guildConfig.catefories
        ? `
            **Please follow the steps to find the matching topic for your request:**

            > - First select the right topic for your question in the dropdown
            > - Then confirm your selection by clicking on "Open ticket".


            *Please do not open tickets without a reason and always use the correct topic.*
        `
        : `
        **Just open a support ticket to get in contact with the team**
        
        *Please do not open tickets without reason or for fun!*`
    )
    .setFooter(
      `${msg.guild?.name} x Anybot`,
      supportClient.user?.displayAvatarURL()
    );

  const message = await channel.send({
    embeds: [embed],
    components: [
      /*
      new MessageActionRow({
        components: [
          {
            customId: "TicketToolDropdown",
            type: 3,
            options: [
              {
                value: "none",
                emoji: "<a:arrow:896538426130726963>",
                label: "Hier Grund wählen",
                default: true,
              },
              /*
                    {
                        value: "TicketToolGlobalQuestion",
                        emoji: "❤️",
                        label: "Allgemeine Frage"
                    },

              {
                value: "TicketToolRankVerify",
                emoji: "💜",
                label: "RL Rank Verifizierung",
              },
              {
                value: "TicketToolDonation",
                emoji: "💚",
                label: "Donation",
              },
              {
                value: "TicketToolUserReport",
                emoji: "🤍",
                label: "User-melden",
              },
              {
                value: "TicketToolTeamComplaint",
                emoji: "💙",
                label: "Teammitglied-Beschwerde",
              },
              {
                value: "TicketToolOther",
                emoji: "💛",
                label: "Sonstiges",
              },
              {
                value: "TicketToolTournamentQuestion",
                emoji: "🏆",
                label: "Turnier Frage",
              },
            ],
          },
        ],
      }),*/
      new MessageActionRow({
        components: [
          {
            type: 2,
            label: "Open Ticket",
            emoji: "📩",
            customId: "TicketToolOpen",
            style: "SUCCESS",
          },
        ],
      }),
    ],
  });

  guildConfig.messageId = message.id;
  writeFileSync("./data/guildConfigs.json", JSON.stringify(setup));
}

export async function createTicketChannel(
  type: string,
  member: GuildMember
): Promise<string | undefined> {
  const setup: GuildConfigs = await JSON.parse(
    readFileSync("./data/guildConfigs.json", "utf-8").toString()
  );
  let guildConfig: GuildConfig = setup[member.guild.id || ""];

  guildConfig.ticketId++;
  writeFileSync("./data/guildConfigs.json", JSON.stringify(setup));

  let mentions: string =
      guildConfig.teamRoles?.map((item) => `<@${item}>`).join(" / ") ||
      "teammember",
    ticketType: string = "ticket-" + guildConfig.ticketId,
    embedDescription: string =
      "You are now in a private chat with the team, feel free to voice your concerns here.";

  switch (type) {
    case "TicketToolDonation":
      embedDescription = `Du befindest dich nun in einem privaten Chat mit dem Team, hier kannst du alle weiteren Details zu deiner Donation abklären.`;
      ticketType = ticketType.replace("ticket", "Donation");
      break;
    case "TicketToolRankVerify":
      embedDescription = `Du befindest dich nun in einem privaten Chat mit dem Serverteam von Rocketment, um deinen Rang zu bekommen sende uns bitte eine Nachricht in dieses Ticket mit folgenden Information:
            > - Deinen [Tracker Link](https://rocketleague.tracker.network/rocket-league/) \nDann werden wir dir so schnell wie möglich weiterhelfen können!`;
      ticketType = ticketType.replace("ticket", "RL-Rank");
      break;
    case "TicketToolTeamComplaint":
      mentions =
        "/ <@&838121178941620231> / <@&962638957877821441> / <@&962639951009292318>";
      embedDescription = `Du befindest dich nun in einem privaten Chat mit der Teamleitung, hier kannst du eine Beschwerde einreichen.`;
      ticketType = ticketType.replace("ticket", "Team-Complaint");
      break;
    case "TicketToolGlobalQuestion":
      embedDescription = `Du befindest dich nun in einem privaten Chat mit dem Team, stelle hier gerne deine Frage.`;
      ticketType = ticketType.replace("ticket", "Allgemein");
      break;
    case "TicketToolUserReport":
      embedDescription = `Du befindest dich nun in einem privaten Chat mit dem Team, hier kannst du einen User melden.`;
      ticketType = ticketType.replace("ticket", "user-melden");
      break;
    case "TicketToolOther":
      embedDescription = `Du befindest dich nun in einem privaten Chat mit dem Team, schildere hier gerne dein Anliegen.`;
      ticketType = ticketType.replace("ticket", "Sonstiges");
      break;

    case "TicketToolTournamentQuestion":
      mentions =
        "<@&812844250361364490> / <@&962639041319305236> / <@&812843353359384597> / <@&838121178941620231>";
      embedDescription = `Du befindest dich nun in einem privaten Chat mit dem Team, stelle hier gerne deine Frage.`;
      ticketType = ticketType.replace("ticket", "Tournament");
      break;

    default:
      break;
  }

  return member.guild.channels
    .create(ticketType, {
      type: "GUILD_TEXT",
      topic: member.user.id,
      parent: guildConfig.categorieId,
      reason: "Ticket-Tool",
    })
    .then(async (channel: TextChannel) => {
      await channel.permissionOverwrites.create(member.user.id, {
        SEND_MESSAGES: true,
        READ_MESSAGE_HISTORY: true,
        VIEW_CHANNEL: true,
      });

      let welcomeEmbed = new MessageEmbed()
        .setColor("#1f991d")
        .setTitle(`Support-Ticket for ${member.user.username}`)
        .setDescription(embedDescription);

      const closeBtn: MessageButton = new MessageButton()
        .setLabel("Close")
        .setEmoji("🔒")
        .setStyle("SECONDARY")
        .setCustomId("TicketToolcloseBtnTicket");

      const delBtn: MessageButton = new MessageButton()
        .setLabel("Delete")
        .setEmoji("⛔")
        .setStyle("DANGER")
        .setCustomId("TicketTooldelBtnTicket");

      await channel.send({
        content: `Hey <@${member.user.id}> \na ${mentions} will get in touch with you in a few moments!`,
        embeds: [welcomeEmbed],
        components: [
          new MessageActionRow({
            components: [closeBtn, delBtn],
          }),
        ],
      });

      return channel.id;
    });
}

export async function closeTicketChannel(
  channel: TextChannel,
  perms: Authentication,
  modName: string,
  callback: any
): Promise<boolean | undefined> {
  const setup: GuildConfigs = await JSON.parse(
      readFileSync("./data/guildConfigs.json", "utf-8").toString()
    ),
    guildConfig: GuildConfig = setup[channel.guild.id || ""];

  if (!perms.team) return;
  if (channel.parentId != guildConfig.categorieId) return;

  channel.permissionOverwrites.cache.forEach(async (permission: any) => {
    if (permission.type != "member") return;

    await channel.permissionOverwrites
      .create(permission.id, {
        VIEW_CHANNEL: false,
        READ_MESSAGE_HISTORY: false,
        SEND_MESSAGES: false,
      })
      .then(async () => {
        const user = await supportClient.users.fetch(permission.id);
        await user
          .send({
            embeds: [
              new MessageEmbed({
                title: `Your support ticket ${channel.name} has been closed!`,
                color: "#34ad4c",
                description:
                  "Feel free to leave feedback about support or a team member on our server!",
              }),
            ],
          })
          .catch((err: any) => {
            error(err, "send User Feedbackembed");
          });
      })
      .catch((err: any) => {
        error(err, "overwrite close channel perms");
      });
  });

  let channelName = channel.name.split("-");

  channel
    .setName(`closed-${channelName[channelName.length - 1]}`)
    .catch((err: any) => {
      error(err, "close channel rename");
    });

  return true;
}

export async function deleteTicketChannel(
  channel: TextChannel,
  perms: Authentication,
  moderator: string
): Promise<void> {
  const setup: GuildConfigs = await JSON.parse(
      readFileSync("./data/guildConfigs.json", "utf-8").toString()
    ),
    guildConfig: GuildConfig = setup[channel.guild.id || ""];

  if (!perms.manager) {
    return;
  }
  if (channel.parentId != guildConfig.categorieId) return;

  await saveTicketChat(channel, moderator);
  channel.delete().catch((err: any) => {
    adminLog(supportClient, err, `trying to delete TCK ${channel.name}`);
  });
}

export async function addUserToTicketChannel(interaction: CommandInteraction,content: string[]): Promise<string | undefined> {
  const setup: GuildConfigs = await JSON.parse(
      readFileSync("./data/guildConfigs.json", "utf-8").toString()
    ),
    guildConfig: GuildConfig = setup[interaction.guild?.id || ""];

  if ((interaction.channel as TextChannel).parentId != guildConfig.categorieId) return;

  let userId = interaction.mentions.users.first()?.id;

  if (!userId) userId = content[0];
  try {
    let user = await supportClient.users.fetch(userId);
  } catch (err) {
    replyError(
      "User hinufügen",
      "member_not_found",
      msg.channel as TextChannel
    );
    return;
  }

  await (msg.channel as TextChannel).permissionOverwrites.create(userId, {
    SEND_MESSAGES: true,
    READ_MESSAGE_HISTORY: true,
    VIEW_CHANNEL: true,
  });

  return userId;
}

export async function saveTicketChat(
  channel: TextChannel,
  moderator: string
): Promise<void> {
  const setup: GuildConfigs = await JSON.parse(
      readFileSync("./data/guildConfigs.json", "utf-8").toString()
    ),
    guildConfig: GuildConfig = setup[channel.guild.id || ""];

  let formattedContributors: string = "",
    contributors: { [name: string]: { messages: number; tag: string } } = {};

  let messages = await channel.messages.fetch({ limit: 100 });

  messages.forEach((message: Message) => {
    if (message.author.bot) return;
    if (!contributors[message.author.id])
      contributors[message.author.id] = {
        messages: 1,
        tag: message.author.tag,
      };

    contributors[message.author.id].messages += 1;
  });

  for (let contributor in contributors) {
    formattedContributors += `<@${contributor}>(${
      contributors[contributor].tag
    }): ${contributors[contributor].messages--}Messages\n`;
  }

  if (formattedContributors == "") formattedContributors = "-no messages-";

  let save = construcSaveHead(channel) + (await generateSaveBody(channel));

  writeFileSync("./cache.html", save);

  if (!guildConfig.log) return;
  const replyChannel = (await supportClient.channels.fetch(
    guildConfig.log
  )) as TextChannel;
  let user: User | void = await supportClient.users
    .fetch(channel.topic as string)
    .catch((err: any) => {
      adminLog(supportClient, err, `fetching User from TCK ${channel.name}`);
    });
  if (!user) return;

  let displayName: string = "unknown";

  try {
    displayName = (await channel.guild.members.fetch(user)).displayName;
  } catch {
    adminLog(
      supportClient,
      "cannot find Member",
      `fetching Member from TCK ${channel.name}`
    );
  }

  let embed = new MessageEmbed()
    .setTitle(`Saved Chat from Ticket ${channel.name}`)
    .setDescription(`Responsible moderator: ${moderator}`)
    .addFields([
      {
        name: "Tags",
        value: `${user.id}, ${user.tag}, ${user.username}, ${displayName}, ${channel.name}`,
      },
      {
        name: "Contributors",
        value: formattedContributors,
      },
    ])
    .setColor("#34ad4c")
    .setFooter(user.id);

  replyChannel
    .send({
      embeds: [embed],
      files: [
        {
          attachment: "./cache.html",
          name: `Ticket von ${user.tag.replace(/#/g, "-")}.html`,
        },
      ],
    })
    .then(() => unlinkSync("./cache.html"));
}

export async function repoenTicketChat(
  channel: TextChannel,
  perms: Authentication,
  moderator: string
): Promise<boolean | void> {
  const setup: GuildConfigs = await JSON.parse(
      readFileSync("./data/guildConfigs.json", "utf-8").toString()
    ),
    guildConfig: GuildConfig = setup[channel.guild.id || ""];

  if (!perms.team) return;
  if (channel.parentId != guildConfig.categorieId) return;

  channel.permissionOverwrites.cache.forEach(async (permission: any) => {
    if (permission.type != "member") return;
    let channelName = channel.name.split("-");

    channel
      .setName(`allgemein-${channelName[channelName.length - 1]}`)
      .catch((err: any) => {});

    await channel.permissionOverwrites.create(permission.id, {
      VIEW_CHANNEL: true,
      READ_MESSAGE_HISTORY: true,
      SEND_MESSAGES: true,
    });
  });

  return true;
}
