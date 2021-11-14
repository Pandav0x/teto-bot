import { Base, Message, MessageOptions, MessagePayload } from "discord.js";
import BaseCommand from "../contracts/BaseCommand";

export default class TetoMessage {

    message: Message;

    caller: BaseCommand;

    constructor(message: Message, caller: BaseCommand){
        this.message = message;
        this.caller = caller;
    }

    send(options: string | MessagePayload | MessageOptions): Promise<Message> {

        return this.message.channel.send(options).then(message => {
            if(this.caller.isRecordable){
                let db = this.caller.client.databaseManager.getDatabase(this.message.guildId);
    
                if(db !== null){
                    db.db?.exec(`INSERT INTO command (teto_message_id, teto_message_content, user_id, user_message_id) VALUES (${message.id}, ${JSON.stringify(message.content)}, ${this.message.author.id}, ${this.message.id});`)
                }
            }

            return message;
        });
    }

    serialize(): string {
        
        
        
        return '';
    }
}