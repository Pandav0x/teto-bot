'use strict';

const Discord = require('discord.js');

module.exports = {
    getName: () => {
        return 'partyfinder';
    },
    getAliases: () => {
        return ['pf', 'raid'];
    },
    getHelp: () => {
        return `${process.env.BOT_PREFIX}partyfinder <xman> [player_comp] [date] [time] [timezone] <description>`;
    },
    execute: (msg, args) => {

        let args_values = [
            {'name': 'xman', 'regex': /\d+man/, 'value': null},
            {'name': 'player_comp', 'regex': /^(\d{1,2},){2}\d{1,2}$/, 'value': null},
            {'name': 'date', 'regex': /^(([0-9]{1,2}(jan|fev|mar|avr|may|jun|jul|aug|sept|oct|dec))|([0-9]{1,2}\/[0-9]{1,2}(\/[0-9]{2,4}|)))$/i, 'value': null},
            {'name': 'time', 'regex': /^[0-9]{1,2}(:[0-9]{2}|)(a|p)m$/, 'value': null},
            {'name': 'timezone', 'regex': /(st|gmt)/i, 'value': null}
        ];

        let unprocessed_args = [...args];

        console.log(unprocessed_args, args);

        args.forEach((arg) => {
            for(let i = 0; i < args_values.length; i++){
                if(args_values[i].regex.test(arg.toString())){
                    args_values[i].value = arg;
                    unprocessed_args.splice(unprocessed_args.indexOf(arg), 1);
                }
            }
        });

        args_values.push({'name': 'description', 'value': unprocessed_args.join(' ')});


        //TODO - create embedded
        //let message = '';

        let formated_array = [];
        args_values.forEach((e) => {
            formated_array[e.name] = e.value;
        });

        console.log(formated_array);


        let exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(formated_array.description ?? 'Oo')
            .setDescription('jalsdjlsjdlaj')
            .addField('Inline field title', 'Some value here', true)
            .setThumbnail('https://static.wikia.nocookie.net/nausicaa/images/a/a4/Fox_squirrel.gif/revision/latest?cb=20100605225647')
            .setDescription('Your group is looking for the following members:')
            .addFields(
                { name: 'heals', value: [[].fill('-', healersNumber)], inline: true },
                { name: 'dps', value: [[].fill('-', dpsNumber)], inline: true })
            .setFooter(`created by ${msg.member.displayName}`);

        msg.channel.send(exampleEmbed);
    },
    getJobFields: (xman, player_comp) => {

        if(xman === null && player_comp === null){
            return [];
        }

        let [tankNumber, healersNumber, dpsNumber] = player_comp.split(',');

        return [
            new Discord.EmbedFieldData(), //TODO
            new Discord.EmbedFieldData(),
            new Discord.EmbedFieldData()
        ];
    }
};