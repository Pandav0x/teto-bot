'use strict';

import { Database, OPEN_READWRITE, OPEN_CREATE } from "sqlite3";

export default class GuildDatabase {
    db: Database|null = null;
    guildId: string;
    name: string;

    constructor(discordGuildId: string){
        this.guildId = discordGuildId;
        this.name = `teto.${this.guildId}.db`;
    }

    connect(): GuildDatabase {
        if(this.db === null){
            this.db = new Database(`./databases/${this.name}`, OPEN_READWRITE | OPEN_CREATE);
        }
        return this;
    }

    disconnect(): void {
        if(this.db !== null){
            this.db.close();
        }
        this.db = null;
    }

    flush(): void {
        this.disconnect();
        this.connect();
    }

    close(): void {
        this.disconnect();
    }

    getDatabase(): Database {
        if(this.db === null){
            this.connect();
        }
        return <Database>this.db;
    }

    getName(): string {
        return this.name;
    }
};