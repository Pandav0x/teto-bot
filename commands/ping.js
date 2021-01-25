'use strict';

module.exports = {
    getName: () => {
        return 'ping';
    },
    getAliases: () => {
        return [];
    },
    execute: (msg, args) => {
        msg.channel.send('pong !');
    }
};