import { Client } from "discord.js";

export interface ClientConfig {
    client: Client;
    prefix: string;
    name: string;
}