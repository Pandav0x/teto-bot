import { Client } from "discord.js";
import GuildDatabase from "./GuildDatabase";
import * as fs from 'fs';
import * as readline from 'readline';

export default class DatabaseManager {

    databasesPool: Map<String, GuildDatabase>;

    constructor() {
        this.databasesPool = new Map<String, GuildDatabase>();
    }

    connectAllDatabases(client: Client){

        console.log('Connecting all databases.');        

        let botGuilds: string[] = client.guilds.cache.map(guild => guild.id);

        for(let i=0; i < botGuilds.length; i++){
            let guildDatabase: GuildDatabase = new GuildDatabase(botGuilds[i]).connect();

            this.initializeDatabase(guildDatabase);

            this.databasesPool.set(botGuilds[i], guildDatabase);
        }        
    }

    initializeDatabase(database: GuildDatabase): void { 
        database.db?.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='general_info';`, [], async (err, rows) => {
            if (err) {                
                throw err;
            }

            if(rows.length === 0){

                console.log(`Initializing ${database.getName()}.`);

                let queryFiles: Set<string> = new Set<string>(['base-schema.sql', ...fs.readdirSync(`${__dirname}/../../schemas/`)]);

                for(let i = 0; i < [...queryFiles].length; i++){

                    let readlineInterface = readline.createInterface({
                        input: fs.createReadStream(`${__dirname}/../../schemas/${[...queryFiles][i]}`),
                        crlfDelay: Infinity
                    });

                    for await (let line of readlineInterface){                       
                        database.db?.exec(line, err => {
                            if(err !== null){
                                console.error(`Error while executing: '${line}'\n${err}`);
                            }
                        });
                    }


                }                
            }
        });
    }

    getDatabase(guildId: String|null): GuildDatabase|null {
        if(guildId === null){
            return null;
        }
        
        if(this.databasesPool.has(guildId)){
            let guildDatabase: GuildDatabase|undefined = this.databasesPool.get(guildId);
            if(typeof guildDatabase == 'undefined'){
                return null;
            }
            return guildDatabase;
        }

        return null;
    }
}