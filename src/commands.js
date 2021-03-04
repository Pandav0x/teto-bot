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
    console.info(`${msg.author.username}: ${msg.content}`);

    let tokens = msg.content.split(' ');
    let command = tokens.shift();

    if(command.charAt(0) === process.env.BOT_PREFIX){
        command = command.substr(1);
        if(commands.hasOwnProperty(command)){
            let response = commands[command].execute(msg, tokens);
            if(response === 0){
                msg.channel.send(`> ${commands[command].getHelp()}`);
            }
        }
    }
};