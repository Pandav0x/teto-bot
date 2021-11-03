import { Client } from "discord.js";
import GuildDatabase from "./GuildDatabase";
import * as fs from 'fs';

export default class DatabaseManager {

    databasesPool: Map<String, GuildDatabase>;

    constructor() {
        this.databasesPool = new Map<String, GuildDatabase>();
    }

    connectAllDatabases(client: Client){

        let botGuilds: string[] = client.guilds.cache.map(guild => guild.id);

        for(let i=0; i < botGuilds.length; i++){
            let guildDatabase: GuildDatabase = new GuildDatabase(botGuilds[i]).connect();

            this.initializeDatabase(guildDatabase);

            this.databasesPool.set(botGuilds[i], guildDatabase);

        }

        console.log(this.databasesPool);
        
    }

    initializeDatabase(database: GuildDatabase): void {

        console.log('executing query');
        

        database.db?.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='general_info';`, [], (err, rows) => {
            if (err) {
                throw err;
            }

            if(rows.length === 0){

                let baseSchemaFile: Buffer = fs.readFileSync(`${__dirname}/../../schemas/base-schema.sql`);

                database.db?.exec(baseSchemaFile.toString());
            }
        }  
        );
    }
}