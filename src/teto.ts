'use strict';

console.log('Teto is waking up.');

import * as dotenv from "dotenv";
import { Client } from "discord.js";
import MessageHandler from "./commands";

dotenv.config();

const client =  new Client({ intents: 7 });

console.log('Attempting connection to discord.');

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.info('Connected.');
    client.user?.setActivity('haha.');
});

client.on('message', (new MessageHandler()).handle);
