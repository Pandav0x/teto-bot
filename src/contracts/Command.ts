import TetoBot from "../TetoBot";
import { Message } from "discord.js";

export default abstract class Command {
    
    client: TetoBot;
    
    isRecordable: boolean = false;

    constructor(client: TetoBot){
        this.client = client;
    }

    abstract getName(): string;
    abstract getAliases(): Array<string>;
    abstract getHelp(): string;
    abstract execute(msg: Message, args: Array<string>): number;
}