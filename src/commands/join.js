'use strict';

const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');

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

        let connection = joinVoiceChannel({
            channelId: userVC.id,
            guildId: userVC.guild.id,
            adapterCreator: userVC.guild.voiceAdapterCreator,
        });
    }
};
