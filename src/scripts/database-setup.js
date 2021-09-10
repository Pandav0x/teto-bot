'use strict';

const lineReader = require('line-reader');
const Database = require('../utils/database');
const path = require('path');
const fs = require('fs');

module.exports = (guildID) => {
    let database = new Database(guildID);

    let scriptPath = path.resolve('schemas/base-schema.sql');

    console.log('Start of db script.');

    let baseSchemaScript = fs.readFileSync(scriptPath).toString();

    database.connection.serialize(() => {
        console.log(baseSchemaScript);
        database.connection.run(baseSchemaScript, (err) => {
            if(err) throw err;
        });
    });

    console.log('End of db script.');
};
