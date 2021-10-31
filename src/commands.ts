'use strict';
import { Message } from 'discord.js';
import CommandHandler from './utils/CommandHandler';

export default class MessageHandler {

    commandHandler: CommandHandler|undefined;

    handle(msg: Message): void {

        if(typeof this.commandHandler == 'undefined'){
            this.commandHandler = new CommandHandler();
        }
              
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

            let registeredCommands = this.commandHandler.getCommands();

            console.log(registeredCommands);
                

            if(typeof registeredCommands == 'undefined') {
                console.log('No commands registered');
                //this.commands = this.registeredCommands(); 
                return;
            }

            if(!registeredCommands.has(command) || typeof registeredCommands.get(command) == 'undefined'){
                return;
            }
            
            let response: number|undefined = registeredCommands.get(command)?.execute(msg, tokens);
            if(response === 0){
                msg.channel.send({ content: `> ${registeredCommands.get(command)?.getHelp()}` });
            }
        }
    }
}
