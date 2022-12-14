import * as fs from 'fs';
import { GuildMember, PartialUser, User } from "discord.js";
import { Authentication } from "../models/permissions.model";
import { Config } from '../models/config.model';
import { GuildConfig, GuildConfigs } from '../models/guildConfigs.model';
import { fetchGuildconfig } from './basics.service';

const config: Config = JSON.parse(fs.readFileSync(`${__dirname}/../../../../config.json`, "utf-8").toString());

export async function authenticate(user: User | PartialUser, member: GuildMember): Promise<Authentication> {
    const guildConfig: GuildConfig = await fetchGuildconfig(member.guild.id);
    
    let perms: Authentication = {
        default: true,
        team: false,
        manager: false,
        owner: false,
    }

    member?.roles.cache.forEach(role => {
        if(!guildConfig || !guildConfig.teamRoles) return;
        if(guildConfig.teamRoles?.includes(role.id)) {
            perms.team = true;
        }

        if(guildConfig.managerRoles?.includes(role.id)) {
            perms.team = true;
            perms.manager = true;
        }

    });

    if(user?.id == config.ownerID) {
        perms.owner = true;
        perms.manager = true;
        perms.team = true;
    }

    return perms;
}