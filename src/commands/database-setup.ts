'use strict';

const dbsetup = require('../scripts/database-setup');
import { Message } from "discord.js";
import Command from "../contracts/command";

export default class DatabaseSetup implements Command {

    getName(): string {
        return 'database';
    }

    getAliases(): Array<string> {
        return [];
    }

    getHelp(): string {
        return `${process.env.BOT_PREFIX}database`;
    }

    execute(msg: Message, args: Array<string>): number {

        dbsetup(msg?.guild?.id);

        msg.channel.send('Database setup over.');

        return 0;
    }
};