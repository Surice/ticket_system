interface Categories {}

export interface GuildConfig {
    teamRoles?: string[];
    managerRoles?: string[];
    log?: string;
    ticketId: number | 0;
    messageId?: string;
    categorieId?: string;
    prefix?: string;
    catefories?: Categories
}

export interface GuildConfigs {
    [id: string]: GuildConfig;
}