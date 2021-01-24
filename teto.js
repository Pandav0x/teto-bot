'use strict';

console.log(`Teto running`);

require('dotenv').config();

const Discord = require('discord.js');
const client =  new Discord.Client();

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.info('Bot connected');
});

client.on('message', (msg) => {
    if(msg.content === 'coucou'){
        msg.channel.send('ye, ye... I\'m here');
    }
    console.info(`${msg.author.username}: ${msg.content}`);
});