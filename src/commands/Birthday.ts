'use strict';

import { Message } from "discord.js";
import Command from "../contracts/Command";
import GuildDatabase from "../utils/GuildDatabase";

export default class Birthday extends Command {

    isRecordable: boolean = true;

    getName(): string {
        return 'birthday';
    };

    getAliases(): Array<string> {
        return [];
    };

    getHelp(): string {
        return `${process.env.BOT_PREFIX}birthday [date]`;
    };

    execute(msg: Message, args: Array<string>): number {
        msg.react('👍');

        let guildDatabase: GuildDatabase|null = this.client.databaseManager.getDatabase(msg.guildId);

        if(guildDatabase === null){
            return -1;
        }

        console.log(guildDatabase);

        guildDatabase.db?.exec(`INSERT INTO birthday () VALUES ()`);

        return 0;
    }
}