'use strict';

const lineReader = require('line-reader');
const Database = require('../utils/database');
const fs = require('fs');

module.exports = (guildID) => {
    let database = new Database(guildID);

    let guildDatabase = database.database

    console.log(database)

    let path ='schemas/base-schema.sql';

    console.log(database.name, path);

    lineReader.eachLine(path, function(line) {
        console.log(`running "${line}" for ${database.name}`);
        database.getDatabase().run(line);
    });
};
