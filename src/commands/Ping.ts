'use strict';

import { Message } from "discord.js";
import BaseCommand from "../contracts/BaseCommand";
import Command from "../contracts/Command";

export default class Ping extends BaseCommand implements Command {
    getName(): string {
        return 'ping';
    };

    getAliases(): Array<string> {
        return [];
    };

    getHelp(): string {
        return `${process.env.BOT_PREFIX}ping`;
    };

    execute(msg: Message, args: Array<string>): number {
        msg.channel.send('pong !');

        return 0;
    }
};