'use strict';

const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    getName: () => {
        return 'leave';
    },
    getAliases: () => {
        return ['l'];
    },
    isAvailable: () => {
        return true;
    },
    getHelp: () => {
        return `${process.env.BOT_PREFIX}leave`;
    },
    execute: (msg, args) => {

        let connection = getVoiceConnection(msg.guild.id);

        connection.destroy();

    }    
};
