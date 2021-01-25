'use strict';

console.log('Teto is waking up.');

require('dotenv').config();

const sqlite3 = require('sqlite3');
const Discord = require('discord.js');

//SQLite3 Database
let db = new sqlite3.Database('./database/teto.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

//Discord Client
const client =  new Discord.Client();

const commandHandler = require('./commands');

console.log('Attempting connection to discord.');

client.login(process.env.BOT_TOKEN);

client.on('ready', () => {
    console.info('Connected.');
    client.user.setActivity('with the nerves of his creator.');
});

client.on('message', commandHandler);
