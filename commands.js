'use strict';

let commands = {};
require('fs').readdirSync('./commands').forEach(function(commandFile) {
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

    if(command.charAt(0) === '!'){
        command = command.substr(1);
        if(commands.hasOwnProperty(command)){
            commands[command].execute(msg, tokens);
        }
    }

    console.info(`${msg.author.username}: ${msg.content}`);
};