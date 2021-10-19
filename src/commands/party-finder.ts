'use strict';

const Discord = require('discord.js');
import { Message } from "discord.js";
import Command from "../contracts/command";

export default class PartyFinder implements Command {
    getName(): string {
        return 'partyfinder';
    }

    getAliases(): Array<string> {
        return ['pf', 'raid'];
    }

    getHelp(): string {
        return `${process.env.BOT_PREFIX}partyfinder <xman> [player_comp] [date] [time] [timezone] <description>`;
    }

    execute(msg: Message, args: Array<string>): number {
        
        let args_values = Array<{name: String, regex: RegExp, value: String|null}>(
            {name: 'xman', regex: /\d+man/, value: null},
            {name: 'player_comp', regex: /^(\d{1,2},){2}\d{1,2}$/, value: null},
            {name: 'date', regex: /^(([0-9]{1,2}(jan|fev|mar|apr|may|jun|jul|aug|sept|oct|dec))|([0-9]{1,2}\/[0-9]{1,2}(\/[0-9]{2,4}|)))$/i, value: null},
            {name: 'time', regex: /^[0-9]{1,2}(:[0-9]{2}|)(a|p)m$/, value: null},
            {name: 'timezone', regex: /(st|gmt)/i, value: null}
        );

        let unprocessed_args = [...args];

        console.log(unprocessed_args, args);

        args.forEach(arg => {
            for(let i = 0; i < args_values.length; i++){
                if(args_values[i].regex.test(arg)){
                    args_values[i].value = arg;
                    unprocessed_args.splice(unprocessed_args.indexOf(arg), 1);
                }
            }
        });

        args_values.push({name: 'description', regex: /.*/,value: unprocessed_args.join(' ')});


        //TODO - create embedded
        //let message = '';

        let formated_array: Map<String, String|null> = new Map<String, String>();

        args_values.forEach((arg => {
            formated_array.set(arg.name, arg.value);
        }));

        console.log(formated_array);

/*
        let exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(formated_array.description ?? 'Oo')
            .setDescription('jalsdjlsjdlaj')
            .addField('Inline field title', 'Some value here', true)
            .setThumbnail('https://static.wikia.nocookie.net/nausicaa/images/a/a4/Fox_squirrel.gif/revision/latest?cb=20100605225647')
            .setDescription('Your group is looking for the following members:');

            /*module.exports.getJobFields(formated_array.xman, formated_array.player_comp).forEach((field, exampleEmbed) => {
               exampleEmbed.addField(field);
            });*/

            //exampleEmbed.setFooter(`created by ${msg?.member?.displayName}`);

        msg.channel.send('check log bro');

        return 0;
    } 

    getJobFields(xman: number|null, player_comp: string|null): Array<object> {

        if(xman === null || player_comp === null){
            return [];
        }

        let [tankNumber, healerNumber, damageNumber] = player_comp.split(',');

        return [
            { name: 'Tank', value: [new Array(tankNumber).fill('-')], inline: true },
            { name: 'Heal', value: [new Array(healerNumber).fill('-')], inline: true },
            { name: 'Damage', value: [new Array(damageNumber).fill('-')], inline: true }
        ];
    }
};