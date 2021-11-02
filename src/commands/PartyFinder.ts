'use strict';

import { Message, MessageEmbed } from "discord.js";
import Command from "../contracts/Command";

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
        
        let argsValues = Array<{name: String, regex: RegExp, value: String|null}>(
            {name: 'xman', regex: /\d+man/, value: null},
            {name: 'player_comp', regex: /^(\d{1,2},){2}\d{1,2}$/, value: null},
            {name: 'date', regex: /^(([0-9]{1,2}(jan|fev|mar|apr|may|jun|jul|aug|sept|oct|dec))|([0-9]{1,2}\/[0-9]{1,2}(\/[0-9]{2,4}|)))$/i, value: null},
            {name: 'time', regex: /^[0-9]{1,2}(:[0-9]{2}|)(a|p)m$/i, value: null},
            {name: 'timezone', regex: /(st|gmt)/i, value: null}
        );

        let unprocessedArgs: string[] = [...args];

        console.log(unprocessedArgs, args);

        args.forEach(arg => {
            for(let i = 0; i < argsValues.length; i++){
                if(argsValues[i].regex.test(arg)){
                    argsValues[i].value = arg;
                    unprocessedArgs.splice(unprocessedArgs.indexOf(arg), 1);
                }
            }
        });

        argsValues.push({name: 'description', regex: /.*/,value: unprocessedArgs.join(' ')});

        let formatedArray: Map<String, String> = new Map<String, String>();

        argsValues.forEach((arg => {
            formatedArray.set(arg.name, arg.value ?? '');
        }));

        console.log(formatedArray);

        let [tanks, heals, damages] = this.getJobFields(
            <number|undefined> formatedArray.get('xman'), 
            <string|undefined> formatedArray.get('player_comp')
        );

        console.log('t/h/d: ', tanks, heals, damages);

        let embedMessage = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(<string> formatedArray.get('description'))
            .setDescription('jalsdjlsjdlaj')
            .addField('Inline field title', 'Some value here', true)
            .addField('Inline field title', 'Some value here', true)
            .addField('Inline field title', 'Some value here', true)
            .addField('Inline field title', 'Some value here', true)
            .setThumbnail('https://static.wikia.nocookie.net/nausicaa/images/a/a4/Fox_squirrel.gif/revision/latest?cb=20100605225647')
            .setDescription('Your group is looking for the following members:')
            .setFooter(`created by ${msg?.member?.displayName}`);

        msg.channel.send({ embeds: [embedMessage] });

        return 0;
    } 

    getJobFields(xman: number|undefined, player_comp: string|undefined): Array<Object> {

        if(typeof xman == 'undefined' || typeof player_comp == 'undefined'){
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