'use strict';

const sqlite3 = require('sqlite3');
const dbsetup = require('../scripts/database-setup');

module.exports = class Database {
    _db  = null;
    _guildId = null;
    _name = null;
    
    constructor(discordGuildId){
        this._guildId = discordGuildId;
        this._name = `teto.${this._guildId}.db`;
    }

    _connect() {
        if(this._db === null){
            this._db = new sqlite3.Database(
                `/teto/databases/${this._name}`, 
                sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
                error => {
                    if(error){
                        console.error(error.message);
                        return false;
                    }
                }
            );
            this._initialize();
        }
        return this;
    }

    _disconnect() {
        this._db.close();
        this._db = null;
    }

    _initialize() {
        dbsetup(this._guildId);
    }

    flush() {
        this._disconnect();
        this._connect();
    }

    close() {
        this._disconnect();
    }

    get database() {
        this._connect();

        return this._db;
    }

    get name() {
        return this._name;
    }
};