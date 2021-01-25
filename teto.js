'use strict';

console.log('Teto running.');

require('dotenv').config();

const Discord = require('discord.js');
const client =  new Discord.Client();

const commandHandler = require('./commands');

console.log('Attempting connection.');

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.info('Connected.');
});

client.on('message', commandHandler);