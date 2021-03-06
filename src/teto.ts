'use strict';

console.log('Teto is waking up.');

import * as dotenv from "dotenv";
dotenv.config();

import * as Discord from "discord.js";
import { Client } from "discord.js";
import * as commandHandler from "./commands";

const client =  new Client();

console.log('Attempting connection to discord.');

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.info('Connected.');
    client.user?.setActivity('with the nerves of his creator.');
});

client.on('message', commandHandler);
