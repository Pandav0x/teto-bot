'use strict';

const lineReader = require('line-reader');
const Database = require('../utils/database');
const fs = require('fs');

module.exports = (guildID) => {
    let database = new Database(guildID);

    let path ='schemas/base-schema.sql';

    console.log(guildID, path);

    console.log(fs.existsSync(path));

    lineReader.eachLine(path, function(line) {
        console.log(`running "${line}" for ${database.getName()}`);
        database.getDatabase().run(line);
    });

};
