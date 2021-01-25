'use strict';

const sqlite3 = require('sqlite3');

module.exports = {
    _db: null,
    _connect: () => {
        if(this._db === null){
            this._db = new sqlite3.Database('./databases/teto.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
        }
        return this;
    },
    getDatabase: () => {
        if(this._db === null){
            this._connect();
        }
        return this._db;
    }
};