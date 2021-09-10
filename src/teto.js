'use strict';

console.log('Teto is waking up.');

require('dotenv').config();

const { Client, Intents} = require('discord.js');
const client =  new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

const commandHandler = require('./commands');

console.log('Attempting connection to discord.');

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.info('Connected.');
    client.user.setActivity('in the valley.');
});

client.on('message', commandHandler);
