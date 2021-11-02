'use strict';

import { Message, MessageEmbed } from "discord.js";
import Command from "../contracts/Command";
import { Emoji } from "../utils/Emoji";

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

        let [tankNumber, healerNumber, damageNumber] = this.getJobFields(
            <string|undefined> formatedArray.get('xman'), 
            <string|undefined> formatedArray.get('player_comp')
        );

        console.log('t/h/d: ', tankNumber, healerNumber, damageNumber);

        let embedMessage = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(<string> formatedArray.get('description'))
            .setDescription('jalsdjlsjdlaj')
            .setThumbnail('https://static.wikia.nocookie.net/nausicaa/images/a/a4/Fox_squirrel.gif/revision/latest?cb=20100605225647')
            .setDescription('Your group is looking for the following members:')
            .setFooter(`Created by ${msg?.member?.displayName}.`);

        if(tankNumber !== 0){
            embedMessage.addField(`${ Emoji.TANK } Tanks`, new String('\n-').repeat(tankNumber), true);
        }

        if(healerNumber !== 0){
            embedMessage.addField(`${ Emoji.HEALER } Healers`, new String('\n-').repeat(tankNumber), true);
        }

        if(damageNumber !== 0){
            embedMessage.addField(`${ Emoji.DPS } Dps`, new String('\n-').repeat(tankNumber), true);
        }

        msg.channel.send({ embeds: [embedMessage] }).then(message => {
            if(tankNumber !== 0){
                message.react(`${ Emoji.TANK }`);
            }
    
            if(healerNumber !== 0){
                message.react(`${ Emoji.HEALER }`);
            }
    
            if(damageNumber !== 0){
                message.react(`${ Emoji.DPS }`);
            }

            message.react(`${ Emoji.BIN }`);
        });

        return 0;
    } 

    getJobFields(xman: string|undefined, player_comp: string|undefined): Array<number> {

        if(typeof xman == 'undefined' || typeof player_comp == 'undefined'){
            return [];
        }

        xman = xman.slice(0, -3);

        let [tankNumber, healerNumber, damageNumber] = new Array(3).fill(0);

        if(player_comp !== ''){
            [tankNumber, healerNumber, damageNumber] = player_comp.split(',').map(i => Number(i));    
        }

        if((xman !== '' && Number.isInteger(Number(xman))) && player_comp === '') {
            switch(Number(xman)){
                case 24:
                    tankNumber += 1;
                    healerNumber += 4;
                    damageNumber += 11;
                case 8:
                    tankNumber += 1;
                    healerNumber += 1;
                    damageNumber += 2;
                case 4:
                    tankNumber += 1;
                    healerNumber += 1;
                    damageNumber += 2;
                break;
            }
        }
        
        return [tankNumber, healerNumber, damageNumber];
    }
};