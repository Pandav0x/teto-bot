'use strict';

const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    getName: () => {
        return 'join';
    },
    getAliases: () => {
        return ['j'];
    },
    isAvailable: () => {
        return true;
    },
    getHelp: () => {
        return `${process.env.BOT_PREFIX}join`;
    },
    execute: (msg, args) => {
        let userVC = msg.member.voice.channel;
        
        userVC.join().then((connection) => {
            console.log(`Joined "${userVC.name}" voice chat from "${userVC.guild.name}" server.`);
        }).catch((err) => {
            console.error(err.message);
        });
    }
};
