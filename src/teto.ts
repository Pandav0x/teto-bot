'use strict';

console.log('Teto is waking up.');

import * as dotenv from "dotenv";
import { Client, Intents } from "discord.js";
import MessageHandler from "./commands";

dotenv.config();

const client =  new Client({ intents: [Intents.FLAGS.GUILDS | Intents.FLAGS.GUILD_MESSAGES | Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

console.log('Setting up external connections.')

client.on('ready', () => {
    client.user?.setActivity('haha.');
    //connect DB here
});

console.log('Attempting connection to discord.');

client.login(process.env.BOT_TOKEN);

client.on('messageCreate', (new MessageHandler()).handle);
