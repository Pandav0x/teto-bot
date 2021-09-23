'use strict';

const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    getName: () => {
        return 'join';
    },
    getAliases: () => {
        return [];
    },
    getHelp: () => {
        return `${process.env.BOT_PREFIX}join`;
    },
    execute: (msg, args) => {
        let userVoiceChan = msg.guild.members.cache.get(msg.author.id).voice.channel;
        const voiceChannel = msg.member.voice.channel

        console.log(
            msg,
            voiceChannel
        )
        
        voiceChannel.join().then(() => {
            console.log(`Joined "${voiceChannel.name}" voice chat from "${voiceChannel.guild.name}" server.`);
        }).catch((err) => {
            console.error(err.message);
        });

    }
};
   