'use strict';

const FCInfo = require('../utils/fc-info');
const Database  = require('../utils/database');

module.exports = {
    getName: () => {
        return 'freecompany';
    },
    getAliases: () => {
        return [
            'fc'
        ];
    },
    getHelp: () => {
        return `${process.env.BOT_PREFIX}fc set datacenter@fc_name`;
    },
    execute: async (msg, args) => {

        return 0;

        //TODO - continue

        if(args.length !== 2){
            return 0;
        }

        if(args[0] !== 'set'){
            return 0;
        }

        if(!args[1].includes('@')){
            return 0;
        }

        msg.react('♣');

        let fcInfo = parseFCInfoFromString(args[1]);

        let freeCompany = await FCInfo.getFreeCompany(fcInfo.server, fcInfo.fcName);

        msg.reactions.removeAll();

        console.log(freeCompany);

        if(freeCompany === null){
            msg.channel.send('The given FC couldn\'t be found');
            return;
        }

        msg.channel.send(freeCompany.toString());

        let database = new Database(msg.channel.guild.id);

        database.getDatabase().run('CREATE TABLE langs (id integer, info text)');
        database.flush();

        let insertStatement = database.getDatabase().prepare('INSERT INTO langs (id, info) VALUES (?, json(?))');
        insertStatement.run(freeCompany.id, JSON.stringify(freeCompany));
        insertStatement.finalize();
        database.close();
    }
};

function parseFCInfoFromString(str){
    let chunks = str.split('@');
    return { server: chunks[0], fcName: chunks[1] };
}