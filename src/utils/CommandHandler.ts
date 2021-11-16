import * as fs from 'fs';
import * as path from 'path';
import Command from "../contracts/Command";
import TetoBot from '../TetoBot';
import Reflection from "./Reflection";

export default class CommandHandler {

    commands: Map<string, Command>;

    client: TetoBot;

    hasRegistered: boolean;

    constructor(client: TetoBot){
        this.hasRegistered = false;
        this.commands = new Map<string, Command>();
        this.client = client;
    }

    registerCommands(): Map<string, Command> {
                
        let commands: Map<string, Command> = new Map<string, Command>();
       
        fs.readdirSync(`${__dirname}/../commands`).forEach((commandFile: string) => {
            
            if(path.extname(commandFile) === '.map') {
                return;
            }

            (new Reflection()).createInstanceFromClassPath(commandFile, this.client).then((cmd: Command) => {
                if(cmd === null){
                    return;
                }

                commands.set(cmd.getName(), cmd);

                let commandAliases = cmd.getAliases();

                if(commandAliases.length !== 0){
                    for(let i = 0; i < commandAliases.length; i++){
                        commands.set(commandAliases[i], cmd);
                    }
                }
            });
        });

        this.hasRegistered = true
        return commands;
    }

    getCommands(): Map<string, Command> {
        if(!this.hasRegistered){
            this.commands = this.registerCommands();
        }
        
        return this.commands;
    }

}