'use strict';

import { Client, ClientOptions, Message, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";
import DatabaseManager from "./database/DatabaseManager";
import CommandHandler from './utils/CommandHandler';
import Reactable from "./contracts/Reactable";

export default class TetoBot extends Client {

    [index: string]: any;

    commandHandler: CommandHandler|undefined;

    databaseManager: DatabaseManager;

    constructor(options: ClientOptions) {
        super(options);
        this.databaseManager = new DatabaseManager();
    }

    handleMessage(msg: Message): void {

        if(typeof this.commandHandler == 'undefined'){
            this.commandHandler = new CommandHandler(this);
        }

        let date = new Date();
              
        console.log(`[${date.getUTCHours()}:${date.getUTCMinutes().toString().padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')}]${msg.author.username}: ${msg.content}`); 

        let tokens: Array<string> = msg.content.split(' ');
        let command: string|undefined = tokens.shift();

        if(command === undefined){
            return;
        }

        if(command.charAt(0) === process.env.BOT_PREFIX){
            command = command.substring(1);
            if(command === undefined){
                return;
            }

            let registeredCommands = this.commandHandler.getCommands();
                            
            if(typeof registeredCommands == 'undefined') {
                console.log('No commands registered.');
                return;
            }

            if(!registeredCommands.has(command) || typeof registeredCommands.get(command) == 'undefined'){
                console.log(`Command ${command} not found.`);
                return;
            }
            
            let response: number|undefined = registeredCommands.get(command)?.execute(msg, tokens);
            if(response !== 0){
                msg.channel.send({ content: `> ${registeredCommands.get(command)?.getHelp()}` });
            }
        }
    }

    handleReactionAdd(reactionOrigin: MessageReaction | PartialMessageReaction , user: User | PartialUser) {       

        if(user.id === process.env.BOT_ID){
            return;
        }

        let date = new Date();

        console.log(`[${date.getUTCHours()}:${date.getUTCMinutes().toString().padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')}]${this.user?.username} reacted with ${reactionOrigin.emoji.toString()}`);

        this.databaseManager.getDatabase(reactionOrigin.message.guildId)?.db?.all(`SELECT * FROM command WHERE teto_message_id=${reactionOrigin.message.id}`, [], async (err, rows) => {
            if(err){
                return;
            }

            if(rows.length === 0){
                return;
            }

            let command: Reactable | undefined = <Reactable|undefined>this.commandHandler?.getCommands().get(rows[0].command);

            if(typeof command == 'undefined'){
                return;
            }

            command.reactionAdd(reactionOrigin, user);
        });
    }

    handleReactionRemove(reactionOrigin: MessageReaction | PartialMessageReaction , user: User | PartialUser) {
        if(user.id === process.env.BOT_ID){
            return;
        }

        let date = new Date();

        console.log(`[${date.getUTCHours()}:${date.getUTCMinutes().toString().padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')}]${this.user?.username} reacted with ${reactionOrigin.emoji.toString()}`);

        this.databaseManager.getDatabase(reactionOrigin.message.guildId)?.db?.all(`SELECT * FROM command WHERE teto_message_id=${reactionOrigin.message.id}`, [], async (err, rows) => {
            if(err){
                return;
            }

            if(rows.length === 0){
                return;
            }

            let command: Reactable | undefined = <Reactable|undefined>this.commandHandler?.getCommands().get(rows[0].command);

            if(typeof command == 'undefined'){
                return;
            }

            command.reactionRemove(reactionOrigin, user);
        });
    }
}
