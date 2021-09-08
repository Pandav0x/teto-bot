'use strict';

const dbsetup = require('../scripts/database-setup');

module.exports = {
    getName: () => {
        return 'database';
    },
    getAliases: () => {
        return [];
    },
    getHelp: () => {
        return `${process.env.BOT_PREFIX}database`;
    },
    execute: (msg, args) => {

        dbsetup(msg.guild.id);

        msg.channel.send({content: 'Database setup over.'});
    }
};