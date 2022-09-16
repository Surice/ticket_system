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
import { readFileSync } from 'fs';

const config: Config = JSON.parse(readFileSync(`${__dirname}/config.json`, "utf-8").toString());
export default config;

import { Client, } from "discord.js";
import { interaction } from "./events/interaction.event";

const supportClient: Client = new Client({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_EMOJIS_AND_STICKERS"], partials: ['MESSAGE', 'REACTION']}),
    supportPrefix = config.prefix;

export {supportClient, supportPrefix};

supportClient.login(config.token).catch(err => {error(err)});

supportClient.on('ready', () => {
    success(`online as "${supportClient.user?.tag}"`, "supportsystem");

    supportClient.user?.setActivity("for love", {type: "WATCHING"});
});

supportClient.on('interactionCreate', interaction);
// supportClient.on('messageCreate', message);