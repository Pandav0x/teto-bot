import * as fs from 'fs';
import * as path from 'path';
import Command from "../contracts/command";
import Reflection from "./Reflection";

export default class CommandHandler {

    commands: Map<string, Command>;

    hasRegistered: boolean;

    constructor(){
        this.hasRegistered = false;
        this.commands = new Map<string, Command>();
    }

    registerCommands(): Map<string, Command> {
        console.log('registerCommands');
        
        let commands: Map<string, Command> = new Map<string, Command>();
       
        fs.readdirSync(`${__dirname}/../commands`).forEach((commandFile: string) => {
            
            if(path.extname(commandFile) === '.map') {
                return;
            }

            let commandInstance = (new Reflection()).createInstanceFromClassPath(commandFile).then((cmd: Command) => {
                if(cmd === null){
                    return;
                }

                commands.set(cmd.constructor.name, cmd);
            });
            
        });

        this.hasRegistered = true
        return commands;
    }

    getCommands() {
        if(!this.hasRegistered){
            this.commands = this.registerCommands();
        }
        
        return this.commands;
    }

}