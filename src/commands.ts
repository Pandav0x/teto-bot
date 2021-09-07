'use strict';

import { Message } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import Command from "./contracts/command";

export default class MessageHandler {

    commands: {[key: string]: Command};

    constructor() {
        let a: {[key: string]: Command} = this.registerCommands();
        this.commands = a;
    }

    registerCommands(): {[key: string]: Command} {
        let commands: {[key: string]: Command} = {};
       
        fs.readdirSync(`${__dirname}/commands`).forEach((commandFile: string) => {
            
            if(path.extname(commandFile) === ".map") {
                return;
            }

            let requiredCommand = require(`${__dirname}/commands/${commandFile}`); 

            if(!requiredCommand.hasOwnProperty("getName") || typeof requiredCommand.getName !== "function") {
                return;
            }          

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
       
       console.log('coucou');
       
        /*console.log(`${msg.author.username}: ${msg.content}`); 

        let tokens: Array<string> = msg.content.split(' ');
        let command: string|undefined = tokens.shift();

        if(command === undefined){
            return;
        }

        console.log(process.env.BOT_PREFIX);
        

        if(command.charAt(0) === process.env.BOT_PREFIX){
            command = command.substr(1); //FIXME
            if(this.commands.hasOwnProperty(command)){
                let response: number = this.commands[command].execute(msg, tokens);
                if(response === 0){
                    msg.channel.send(`> ${this.commands[command].getHelp()}`);
                }
            }
        }*/
    }
}
