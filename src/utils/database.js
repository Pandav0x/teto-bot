'use strict';

const sqlite3 = require('sqlite3');

module.exports = class Database {
    _connection  = null;
    _guildId = null;
    _name = null;
    
    constructor(discordGuildId){
        this._guildId = discordGuildId;
        this._name = `teto.${this._guildId}.db`;
    }

    _connect() {
        if(this._connection === null){
            this._connection = new sqlite3.Database(
                `/teto/databases/${this._name}`, 
                sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
                error => {
                    if(error){
                        console.error(error.message);
                        return false;
                    }
                }
            );
        }
        return this;
    }

    _disconnect() {
        this._connection.close();
        this._connection = null;
    }

    flush() {
        this._disconnect();
        this._connect();
    }

    close() {
        this._disconnect();
    }

    get connection() {
        this._connect();

        return this._connection;
    }

    get name() {
        return this._name;
    }
};