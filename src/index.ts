import { error, info, success } from './__shared/service/logger';

info(`
:'######::'##::::'##:'########::'####::'######::'########:
'##... ##: ##:::: ##: ##.... ##:. ##::'##... ##: ##.....::
 ##:::..:: ##:::: ##: ##:::: ##:: ##:: ##:::..:: ##:::::::
. ######:: ##:::: ##: ########::: ##:: ##::::::: ######:::
:..... ##: ##:::: ##: ##.. ##:::: ##:: ##::::::: ##...::::
'##::: ##: ##:::: ##: ##::. ##::: ##:: ##::: ##: ##:::::::
. ######::. #######:: ##:::. ##:'####:. ######:: ########:
:......::::.......:::..:::::..::....:::......:::........::
\n`);

info("loading all dependencies", "startup");
import { Config } from './__shared/models/config.model';
import { readFileSync, writeFileSync } from 'fs';

const config: Config = JSON.parse(readFileSync(`${__dirname}/../config.json`, "utf-8").toString());
export default config;

import { Client, Guild, } from "discord.js";
import { interaction } from "./events/interaction.event";
import { GuildConfigs } from './__shared/models/guildConfigs.model';

const supportClient: Client = new Client({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_EMOJIS_AND_STICKERS"], partials: ['MESSAGE', 'REACTION']}),
    supportPrefix = config.prefix;

export {supportClient, supportPrefix};

supportClient.login(config.token).catch(err => {error(err)});

supportClient.on('ready', () => {
    success(`online as "${supportClient.user?.tag}"`, "supportsystem");

    supportClient.user?.setActivity("for love", {type: "WATCHING"});
});

supportClient.on('interactionCreate', interaction);

supportClient.on('guildCreate', (guild: Guild) => {
    let configs: GuildConfigs = JSON.parse(readFileSync(`${__dirname}/../data/guildConfigs.json`, "utf-8").toString());
    
    if(!configs[guild.id as string]) configs[guild.id as string] = {
        ticketId: 0
    }

    writeFileSync(`${__dirname}/../data/guildConfigs.json`, JSON.stringify(configs));
});