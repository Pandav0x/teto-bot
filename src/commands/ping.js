'use strict';

module.exports = {
    getName: () => {
        return 'ping';
    },
    getAliases: () => {
        return [];
    },
    available: () => {
        return true;
    },
    getHelp: () => {
        return `${process.env.BOT_PREFIX}ping`;
    },
    execute: (msg, args) => {
        msg.channel.send({content: 'pong !'});
    }
};