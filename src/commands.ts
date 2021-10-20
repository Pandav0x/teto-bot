'use strict';

import { Message } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import Command from './contracts/command';

export default class MessageHandler {

    commands: {[key: string]: Command};

    constructor() {
        this.commands = this.registerCommands();
    }

    registerCommands(): {[key: string]: Command} {
        console.log('registerCommands');
        
        let commands: {[key: string]: Command} = {};
       
        fs.readdirSync(`${__dirname}/commands`).forEach((commandFile: string) => {
            
            if(path.extname(commandFile) === '.map') {
                return;
            }

            let requiredCommand = require(`${__dirname}/commands/${commandFile}`); 

            if(!Object.prototype.hasOwnProperty.call(requiredCommand, 'getName')) {
                return;
            }

            commands[requiredCommand.getName()] = requiredCommand;
            if(requiredCommand.getAliases() !== []){
                requiredCommand.getAliases().forEach((alias: string) => {
                    commands[alias] = commands[requiredCommand.getName()];
                });
            }
        });

        console.log('from method:', commands);

        return commands;
    }

    handle(msg: Message): void {
              
        console.log(`${msg.author.username}: ${msg.content}`); 

        let tokens: Array<string> = msg.content.split(' ');
        let command: string|undefined = tokens.shift();

        if(command === undefined){
            return;
        }

        console.log(this.commands);

        if(command.charAt(0) === process.env.BOT_PREFIX){
            command = command.substr(1); //FIXME
            if(command === undefined){
                return;
            }
            if(Object.prototype.hasOwnProperty.call(this.commands, command)){
                let response: number = this.commands[command].execute(msg, tokens);
                if(response === 0){
                    msg.channel.send({ content: `> ${this.commands[command].getHelp()}` });
                }
            }
        }
    }
}
