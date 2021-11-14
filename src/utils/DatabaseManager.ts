import { Client } from "discord.js";
import GuildDatabase from "./GuildDatabase";
import * as fs from 'fs';

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
        
        console.log(`Intializing DBs`);

        database.db?.all(`SELECT name FROM sqlite_master WHERE type='table' AND name='general_info';`, [], (err, rows) => {
            if (err) {
                console.log('omegalul');
                
                throw err;
            }

            if(rows.length === 0){

                //TODO - clean here (maybe a Set ?)

                console.log(`Initializing ${database.getName()}.`);

                let baseSchemaFile: Buffer = fs.readFileSync(`${__dirname}/../../schemas/base-schema.sql`);

                database.db?.exec(baseSchemaFile.toString(), err => {
                    if(err !== null){
                        console.error(`Error while executing: '${baseSchemaFile.toString()}'\n${err}`);
                    }
                });
                
                let shemasFiles: string[] = fs.readdirSync(`${__dirname}/../../schemas/`);

                for(let i = 0; i < shemasFiles.length; i++){
                    let commandSchema: Buffer = fs.readFileSync(`${__dirname}/../../schemas/${shemasFiles[i]}`);  
                    database.db?.exec(commandSchema.toString(), err => {
                        if(err !== null){
                            console.error(`Error while executing: '${commandSchema.toString()}'\n${err}`);
                        }
                    });
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