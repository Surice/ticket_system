interface Categories {}

export interface GuildConfig {
    ticketId: number | 0;
    teamRoles?: string[];
    managerRoles?: string[];
    log?: string;
    messageId?: string;
    categorieId?: string;
    prefix?: string;
    catefories?: Categories
}

export interface GuildConfigs {
    [id: string]: GuildConfig;
}