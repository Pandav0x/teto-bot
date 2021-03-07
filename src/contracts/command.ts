'use strict';

import { Message } from "discord.js";

export default interface Command {
    getName(): string;
    getAliases(): Array<string>;
    getHelp(): string;
    execute(msg: Message, args: Array<string>): number;
}