import { Collection, Guild, GuildMember, MessageMentions, User } from "discord.js";
import { supportClient } from "../..";
import { error } from "./logger";

export async function fetchUser(userId: string): Promise<User> {
    const user: User | void = await supportClient.users.fetch(userId).catch(error => {
        error("cannot Fetch User" + userId);
    });;
    return user as User;
}

export async function fetchMember(memberId: string, guild: Guild, mentions?: Collection<string, GuildMember>): Promise<GuildMember | undefined> {
    let member: GuildMember | void;

    if (mentions?.first()) member = mentions.first();
    else {
        member = await guild.members.fetch(memberId).catch(err => {
            error("cannot Fetch User" + memberId);
        });
    }


    if (!member) return;


    return member;
}