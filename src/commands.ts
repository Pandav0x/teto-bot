'use strict';

import { Message } from "discord.js";
import * as fs from "fs";
import Command from "./contracts/command";

export default class MessageHandler {

    commands: {[key: string]: Command};

    constructor() {
        let a: any = this.registerCommands();
        console.log(a);
        this.commands = a;
    }

    registerCommands(): {[key: string]: Command} {
        let commands: {[key: string]: Command} = {};
        fs.readdirSync('./src/commands').forEach(function(commandFile: string) {
            let requiredCommand = require('./commands/' + commandFile);
            commands[requiredCommand.getName()] = requiredCommand;
            if(requiredCommand.getAliases() !== []){
                requiredCommand.getAliases().forEach((alias: string) => {
                    commands[alias] = commands[requiredCommand.getName()];
                });
            }
        });
        return commands;
    }

    handle(msg: Message): void {
        console.info(`${msg.author.username}: ${msg.content}`);

        let tokens: Array<string> = msg.content.split(' ');
        let command: string|undefined = tokens.shift();

        if(command === undefined){
            return;
        }

        if(command.charAt(0) === process.env.BOT_PREFIX){
            command = command.substr(1);
            if(this.commands.hasOwnProperty(command)){
                let response: number = this.commands[command].execute(msg, tokens);
                if(response === 0){
                    msg.channel.send(`> ${this.commands[command].getHelp()}`);
                }
            }
        }
    }
}
