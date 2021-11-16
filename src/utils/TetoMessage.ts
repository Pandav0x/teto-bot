import { Base, Message, MessageOptions, MessagePayload } from "discord.js";
import { Statement } from "sqlite3";
import BaseCommand from "../contracts/Command";

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
                    let statement: Statement|undefined = db.db?.prepare(`INSERT INTO command (command, teto_message_id, teto_message_content, user_id, user_message_id) VALUES (?, ?, ?, ?, ?);`)
                    statement?.run(this.caller.getName(), message.id, JSON.stringify(message), this.message.author.id, this.message.id);
                }
            }

            return message;
        });
    }
}