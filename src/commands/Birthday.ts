'use strict';

import { Message } from "discord.js";
import BaseCommand from "../contracts/BaseCommand";
import Command from "../contracts/Command";
import GuildDatabase from "../utils/GuildDatabase";

export default class Birthday extends BaseCommand implements Command {
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

        return 0;
    }
}