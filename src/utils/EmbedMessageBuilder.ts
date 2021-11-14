import { MessageEmbed } from "discord.js";
import { title } from "process";
import { isNullOrUndefined } from "util";
import TetoMessage from "./TetoMessage";

export default class MessageEmbedSerializer {
    constructor() {

    }

    serialize(message: MessageEmbed): string {

        let serializedMessage = {
            color: message.color,
            title: message.title,
            thumbnail: message.thumbnail,
            description: message.description,
            footer: message.footer,
            timeStamp: message.timestamp,
            fields: <Object[]>[]
        };

        if(message.fields.length !== 0){
            for(let i = 0; i < message.fields.length; i++){
                serializedMessage.fields.push({
                    name: message.fields[i].name,
                    value: message.fields[i].value,
                    inline: message.fields[i].inline ?? false,
                    number: i
                })
            }
        }

        console.log(serializedMessage);

        console.log(JSON.stringify(serializedMessage));        

        return '';
    }

    unserialize(message: string): Object {
        return {};
    }

}