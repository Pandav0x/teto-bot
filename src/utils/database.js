'use strict';

const sqlite = require('sqlite');

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
            this._db = new sqlite.Database(`./databases/${this._name}`, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
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

    getName() {
        return this._name;
    }
};