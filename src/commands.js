'use strict';

let commands = {};
require('fs').readdirSync('./src/commands').forEach(function(commandFile) {
    let requiredCommand = require('./commands/' + commandFile);
    commands[requiredCommand.getName()] = requiredCommand;
    if(requiredCommand.getAliases() !== []){
        requiredCommand.getAliases().forEach((alias) => {
            commands[alias] = commands[requiredCommand.getName()];
        });
    }
});

module.exports = (msg) => {
    let tokens = msg.content.split(' ');
    let command = tokens.shift();

    if(command.charAt(0) === process.env.BOT_PREFIX){
        console.info(`${msg.author.username}: ${msg.content}`);
        command = command.substr(1);
        if(commands.hasOwnProperty(command)){
            if(commands[command].isAvailable()){
                let response = commands[command].execute(msg, tokens);
                if(response === 0){
                    msg.channel.send({ content: `> ${commands[command].getHelp()}`});
                }
            } else {
                msg.channel.send({ content: `The command \`> ${commands[command].getName()}\` is not available at the moment.`});
            }
        }
    }
};