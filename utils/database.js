'use strict';

const sqlite3 = require('sqlite3');

module.exports = class Database {
    _db  = null;
    _guildId = null;
    constructor(discordGuildId){
        this._guildId = discordGuildId;
    }

    _connect() {
        if(this._db === null){
            this._db = new sqlite3.Database(`./databases/teto.${this._guildId}.db`, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
        }
        return this;
    }

    _disconnect() {
        this._db.close();
        this._db = null;
    }

    flush() {
        this._disconnect();
        this._connect();
    }

    close() {
        this._disconnect();
    }

    getDatabase() {
        if(this._db === null){
            this._connect();
        }
        return this._db;
    }
};