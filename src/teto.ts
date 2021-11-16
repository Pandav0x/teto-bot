'use strict';

console.log('Teto is waking up.');

import * as dotenv from "dotenv";
import TetoBot from "./TetoBot";
import { Intents } from "discord.js";

dotenv.config();

const client =  new TetoBot({ intents: [Intents.FLAGS.GUILDS | Intents.FLAGS.GUILD_MESSAGES | Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.on('ready', () => {
    console.log('Client Ready.');
    client.user?.setActivity('in the valley of the wind.');
    client.databaseManager.connectAllDatabases(client);
});

console.log('Attempting connection to discord.');

client.login(process.env.BOT_TOKEN);

client.on('messageCreate', client.handleMessage);

client.on('messageReactionAdd', client.handleReaction);
