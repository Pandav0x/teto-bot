'use strict';

console.log('Teto is waking up.');

import * as dotenv from "dotenv";
import TetoBot from "./TetoBot";
import { Intents, MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";

dotenv.config();

const client =  new TetoBot({ intents: [Intents.FLAGS.GUILDS | Intents.FLAGS.GUILD_MESSAGES | Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.on('ready', () => {
    console.log('Client Ready.');
    client.user?.setActivity('in the valley of the wind.');
    client.databaseManager.connectAllDatabases(client);
});

console.log('Attempting connection to discord.');

client.login(process.env.BOT_TOKEN);

client.on('messageCreate', client.handle);

client.on('messageReactionAdd', (reaction_orig: MessageReaction | PartialMessageReaction , user: User | PartialUser) => {
    if(reaction_orig.message.author?.id === client.user?.id){
        console.log(`reaction by ${user.username}`);
    }
});
