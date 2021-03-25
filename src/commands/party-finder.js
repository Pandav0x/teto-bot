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

        let exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(formated_array.description ?? 'Title')
            .setThumbnail('https://static.wikia.nocookie.net/nausicaa/images/a/a4/Fox_squirrel.gif/revision/latest?cb=20100605225647')
            .setDescription('Your group is looking for the following members:')
            .setFooter(`created by ${msg.member.displayName}`);

            if(formated_array['time'] !== null || formated_array['timezone'] !== null){
                exampleEmbed.addFields({name: 'Time', value: `${module.exports.getDate(formated_array['time'], formated_array['timezone'])}`});
            }

            let composition = module.exports.getJobFields(formated_array['xman'], formated_array['player_comp']);

            composition.forEach((job) => {
                console.log(job);
                exampleEmbed.addFields(job);
            });

        msg.channel.send(exampleEmbed);
    },
    getJobFields: (xman, player_comp) => {

        if(xman === null && player_comp === null){
            return [];
        }

        let tankNumber, healNumber, dpsNumber;

        switch(xman){
            case '4man':
                [tankNumber, healNumber, dpsNumber] = [1, 1, 2];
                break;
            case '8man':
                [tankNumber, healNumber, dpsNumber] = [2, 2, 4];
                break;
            case '16man':
                [tankNumber, healNumber, dpsNumber] = [2, 4, 10];
                break;
            default:
                [tankNumber, healNumber, dpsNumber] = player_comp.split(',');
                break;
        }

        let response = [];

        if(tankNumber > 0){
            response.push({name: 'Tank', value: [...Array(parseInt(tankNumber)).fill('-')], inline: true});
        }

        if(healNumber > 0){
            response.push({name: 'Heal', value: [...Array(parseInt(healNumber)).fill('-')], inline: true});
        }

        if(dpsNumber > 0){
            response.push({name: 'DPS', value: [...Array(parseInt(dpsNumber)).fill('-')], inline: true});
        }

        return response;
    },
    getDate: (time, timezone) => {

        //FIXME

        let now = new Date();
        let scheduledFor = new Date(`${now.getDay()} ${time}`);

        console.log(`${now.getDate} ${time}`, scheduledFor);

        return 'demain';
    }
};