'use strict';

import { Message } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import Command from './contracts/command';

export default class MessageHandler {

    commands: Map<string, Command>;

    constructor() {
        this.commands = this.registerCommands();        
    }

    registerCommands(): Map<string, Command> {
        console.log('registerCommands');
        
        let commands: Map<string, Command> = new Map<string, Command>();
       
        fs.readdirSync(`${__dirname}/commands`).forEach((commandFile: string) => {
            
            if(path.extname(commandFile) === '.map') {
                return;
            }

            let commandInstance = this.createInstance(commandFile).then((cmd: Command) => {
                if(cmd === null){
                    return;
                }

                commands.set(cmd.constructor.name, cmd);
            });
            
        });

        return commands;
    }

    async createInstance(commandFile: string) {

        let command = await import(`${__dirname}/commands/${commandFile}`);
            if(typeof command.default == 'undefined'){
                return null;
            }
    
        let constructorName = Object.keys(command)[0];
    
        let commandInstance: any = new command[constructorName]();
    
        console.log(commandInstance);

        return commandInstance;
    }

    handle(msg: Message): void {
              
        console.log(`${msg.author.username}: ${msg.content}`); 

        let tokens: Array<string> = msg.content.split(' ');
        let command: string|undefined = tokens.shift();

        if(command === undefined){
            return;
        }

        if(command.charAt(0) === process.env.BOT_PREFIX){
            command = command.substr(1); //FIXME
            if(command === undefined){
                return;
            }

            console.log(this.commands);

            console.log(this.constructor.name);
                

            if(typeof this.commands == 'undefined') {
                console.log('No commands registered');
                //this.commands = this.registerCommands(); //FIXME - delgate remove other methods? 
                return;
            }

            if(!this.commands.has(command) || typeof this.commands.get(command) == 'undefined'){
                return;
            }
            
            let response: number|undefined = this.commands.get(command)?.execute(msg, tokens);
            if(response === 0){
                msg.channel.send({ content: `> ${this.commands.get(command)?.getHelp()}` });
            }
        }
    }
}
