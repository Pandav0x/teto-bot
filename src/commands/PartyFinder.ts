'use strict';

import { EmbedField, Message, MessageEmbed, MessageReaction, PartialMessageReaction, PartialUser, ReactionCollector, User } from "discord.js";
import Command from "../contracts/Command";
import Reactable from "../contracts/Reactable";
import { Emoji } from "../utils/Emoji";
import TetoMessage from "../utils/TetoMessage";
import { TimeZone } from "../utils/TimeZone";

export default class PartyFinder extends Command implements Reactable {

    isRecordable: boolean = true;

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
            {name: 'date', regex: /^([0-9]{1,2}\/[0-9]{1,2}(\/[0-9]{2,4}|))$/i, value: null},
            {name: 'time', regex: /^[0-9]{1,2}(:[0-9]{2}|)(a|p)m$/i, value: null},
            {name: 'timezone', regex: /(st|gmt|cest|cet|bst)/i, value: null}
        );

        let unprocessedArgs: string[] = [...args];

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

        let [tankNumber, healerNumber, damageNumber] = this.getJobFields(
            <string|undefined> formatedArray.get('xman'), 
            <string|undefined> formatedArray.get('player_comp')
        );

        let date: Date = this.parseDate(<string>formatedArray.get('date'), <string>formatedArray.get('time'), <string>formatedArray.get('timezone'));

        // Embed message creation
        let embedMessage = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(<string> formatedArray.get('description'))
            .setThumbnail('https://static.wikia.nocookie.net/nausicaa/images/a/a4/Fox_squirrel.gif/revision/latest?cb=20100605225647')
            .setDescription('Your group is looking for the following members:')
            .addField('Time', `On the **${this.formatDate(date)}** at **${this.timeTo12Hours(date.getUTCHours())} ST**`)
            .setFooter(`Created by ${msg?.member?.displayName}.`)
            .setTimestamp();

        if(tankNumber !== 0){
            embedMessage.addField(`${ Emoji.TANK } Tanks`, new String('\n-').repeat(tankNumber), true);
        }

        if(healerNumber !== 0){
            embedMessage.addField(`${ Emoji.HEALER } Healers`, new String('\n-').repeat(healerNumber), true);
        }

        if(damageNumber !== 0){
            embedMessage.addField(`${ Emoji.DPS } Dps`, new String('\n-').repeat(damageNumber), true);
        }

        let a = new TetoMessage(msg, this);

        a.send({ embeds: [embedMessage] }).then(message => {
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

    timeTo24Hours(time: String|undefined): number{

        if(typeof time == 'undefined'){
            return new Date().getTime();
        }
                
        let abbreviation: string = time.substr(-2).toLowerCase();
        let hour: number = Number(time.slice(0, -2));

        if(abbreviation === 'pm'){
            hour += 12;
        }

        hour %= 24;

        return hour;
    }

    timeTo12Hours(time: number):String {
        return `${time%12}${(time < 12)? 'am' : 'pm'}`;
    }

    getHoursMinutes(date: Date): string {
        return `${date.getHours()}:${date.getMinutes()}`;
    }

    formatDate(date: Date): string {
        return date.toLocaleDateString('en-uk', {
            day: '2-digit',
            weekday: 'short',
            month: 'short',
            year: 'numeric'
        })
    }

    parseDate(date: string|undefined, time: string|undefined, timeZone: string|undefined): Date {

        if(typeof date == 'undefined' && typeof time == 'undefined'){
            return new Date();
        }

        if(typeof timeZone == 'undefined' || timeZone.toUpperCase() === 'ST'){
            timeZone = 'GMT';
        }

        timeZone = timeZone.toUpperCase();

        let timeZoneOffset = '+0:00';

        if(TimeZone.hasOwnProperty(timeZone)) {
            timeZoneOffset = TimeZone[timeZone as keyof typeof TimeZone];
        }
        
        let d = new Date(Date.parse(<string>date));

        let e = new Date(`${d.getUTCFullYear()}-${d.getMonth()}-${d.getUTCDate()} ${this.timeTo24Hours(time)}:00:00.000 GMT${timeZoneOffset}`);
        
        return e;
    }

    formatTime(date: Date): string {
        return `${date.getUTCDay()} ${date.getDay()} ${date.getFullYear()}`;
    }

    reacted(reactionOrigin: MessageReaction | PartialMessageReaction, user: User | PartialUser): void {

        if(reactionOrigin.emoji.toString() === Emoji.BIN){
            reactionOrigin.message.delete();
        }

        if(reactionOrigin.emoji.toString() === Emoji.TANK){
            let freeSpots = this.getFreeSpots(reactionOrigin.message.embeds[0].fields, 'tank', user);
            
            if(freeSpots === 0){
                reactionOrigin.remove();
            }

            
        }

        if(reactionOrigin.emoji.toString() === Emoji.HEALER){

        }

        if(reactionOrigin.emoji.toString() === Emoji.DPS){

        }


        console.log(`reaction by ${user.username}`);
    }

    getFreeSpots(fields: EmbedField[], job: string, user: User | PartialUser) {        
        let field: EmbedField | undefined;

        let jobRegex = new RegExp(`^.*${job.toLocaleLowerCase()}.*$`, 'ig')

        console.log(jobRegex.source);
        

        for(let i = 0; i < fields.length; i++){
            if(jobRegex.test(fields[i].name)){
                field = fields[i];
            }
        }

        if(typeof field == 'undefined'){
            return 0;
        }

        let freeSpots = field.value.split('\n').filter(e => e === '-');


        if(freeSpots.length === 0){
            return 0;
        }
    }
};