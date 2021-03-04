'use strict';

console.log('Teto is waking up.');

require('dotenv').config();

const Discord = require('discord.js');
const client =  new Discord.Client();

const commandHandler = require('./commands');

console.log('Attempting connection to discord.');

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.info('Connected.');
    client.user.setActivity('with the nerves of his creator.');
});

client.on('message', commandHandler);
