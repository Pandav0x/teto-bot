'use strict';

console.log('Teto is waking up.');

import * as dotenv from "dotenv";
import TetoBot from "./client";
import { Intents } from "discord.js";

dotenv.config();

const client =  new TetoBot({ intents: [Intents.FLAGS.GUILDS | Intents.FLAGS.GUILD_MESSAGES | Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

console.log('Setting up external connections.')

client.on('ready', () => {
    client.user?.setActivity('in the valley of the wind.');
    //connect DB here
});

console.log('Attempting connection to discord.');

client.login(process.env.BOT_TOKEN);

client.on('messageCreate', client.messageHandler.handle);
