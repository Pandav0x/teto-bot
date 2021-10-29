'use strict';

import { Client, ClientOptions } from "discord.js";
import MessageHandler from "./commands";

export default class TetoBot extends Client {

    messageHandler: MessageHandler;

    constructor(options: ClientOptions) {
        super(options);
        this.messageHandler = new MessageHandler();
    }

}
