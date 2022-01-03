'use strict';

import { EmbedField, Message, MessageReaction, PartialMessageReaction, PartialUser, User, GuildMember, UserResolvable } from "discord.js";
import Command from "../contracts/Command";
import Reactable from "../contracts/Reactable";
import ClientSearch from "../utils/ClientSearch";
import DateTools from "../utils/DateTimeFormatter";
import { Emoji } from "../utils/Emoji";
import PFEmbedBuilder from "../utils/PFEmbedBuilder";
import TetoMessage from "../utils/TetoMessage";

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

        let [tanksNumber, healersNumber, damagesNumber] = this.getJobFields(
            <string|undefined> formatedArray.get('xman'), 
            <string|undefined> formatedArray.get('player_comp')
        );

        let dateTools = new DateTools();

        let date: Date = dateTools.parseDate(<string>formatedArray.get('date'), <string>formatedArray.get('time'), <string>formatedArray.get('timezone'));

        // Embed message creation
        let embedMessage = new PFEmbedBuilder(msg.guild);
        embedMessage.setTitle(<string> formatedArray.get('description'))
            .setDate(date)
            .setFooter(`Created by ${msg?.member?.displayName}.`)
            .setTHDNumbers(tanksNumber, healersNumber, damagesNumber);

        let tetoMessage = new TetoMessage(msg, this);

        tetoMessage.send({ embeds: [embedMessage.getEmbed()] }).then(message => {
            if(tanksNumber != 0){
                message.react(`${ Emoji.TANK }`);
            }

            if(healersNumber != 0){
                message.react(`${ Emoji.HEALER }`);
            }

            if(damagesNumber != 0){
                message.react(`${ Emoji.DPS }`);
            }

            message.react(`${ Emoji.BIN }`);
        });

        return 0;
    } 

    getJobFields(xman: string|undefined, playerComp: string|undefined): Array<number> {

        if(typeof xman == 'undefined' || typeof playerComp == 'undefined'){
            return [];
        }

        xman = xman.slice(0, -3);

        let [tankNumber, healerNumber, damageNumber] = new Array(3).fill(0);

        if(playerComp != ''){
            [tankNumber, healerNumber, damageNumber] = playerComp.split(',').map(i => Number(i));    
        }

        if((xman != '' && Number.isInteger(Number(xman))) && playerComp == '') {
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

    reactionAdd(reactionOrigin: MessageReaction | PartialMessageReaction, user: User | PartialUser): void {

        //TODO - clean this
        
        let member: GuildMember|undefined = reactionOrigin.message.guild?.members.cache.find(m => m.user == user);

        if(typeof member == 'undefined'){
            return;
        }

        let embedMessage: PFEmbedBuilder = PFEmbedBuilder.instanciateFromMessage(reactionOrigin.message.guild, reactionOrigin.message.embeds[0]);

        if(reactionOrigin.emoji.toString() == Emoji.BIN){
            reactionOrigin.message.delete();
        }

        if(reactionOrigin.emoji.toString() == Emoji.TANK){
            let member: GuildMember|null = (new ClientSearch()).getGuildMemberFromUser(reactionOrigin.message.guild, <User>user);

            if(member == null)
            {
                return;
            }

            if(embedMessage.healers.includes(member) || embedMessage.damages.includes(member)){
                reactionOrigin.users.remove(<UserResolvable>user);
            }

            embedMessage.addTank(member);
        }

        if(reactionOrigin.emoji.toString() == Emoji.HEALER){
            let member: GuildMember|null = (new ClientSearch()).getGuildMemberFromUser(reactionOrigin.message.guild, <User>user);

            if(member == null)
            {
                return;
            }

            if(embedMessage.tanks.includes(member) || embedMessage.damages.includes(member)){
                reactionOrigin.users.remove(<UserResolvable>user);
            }

            embedMessage.addHealer(member);
        }

        if(reactionOrigin.emoji.toString() == Emoji.DPS){
            let member: GuildMember|null = (new ClientSearch()).getGuildMemberFromUser(reactionOrigin.message.guild, <User>user);

            if(member == null)
            {
                return;
            }

            if(embedMessage.tanks.includes(member) || embedMessage.healers.includes(member)){
                reactionOrigin.users.remove(<UserResolvable>user);
            }

            embedMessage.addDamage(member);
        }

        reactionOrigin.message.edit({embeds: [embedMessage.getEmbed()]});

        console.log(`reaction added by ${member.displayName}`);
    }

    reactionRemove(reactionOrigin: MessageReaction | PartialMessageReaction, user: User | PartialUser): void {

        //TODO - clean this

        let member: GuildMember|undefined = reactionOrigin.message.guild?.members.cache.find(m => m.user == user);

        if(typeof member == 'undefined'){
            return;
        }

        let embedMessage: PFEmbedBuilder = PFEmbedBuilder.instanciateFromMessage(reactionOrigin.message.guild, reactionOrigin.message.embeds[0]);

        if(reactionOrigin.emoji.toString() == Emoji.TANK){
            let member: GuildMember|null = (new ClientSearch()).getGuildMemberFromUser(reactionOrigin.message.guild, <User>user);

            if(member == null)
            {
                return;
            }

            embedMessage.removeTank(member);
        }

        if(reactionOrigin.emoji.toString() == Emoji.HEALER){
            let member: GuildMember|null = (new ClientSearch()).getGuildMemberFromUser(reactionOrigin.message.guild, <User>user);

            if(member == null)
            {
                return;
            }

            embedMessage.removeHealer(member);
        }

        if(reactionOrigin.emoji.toString() == Emoji.DPS){
            let member: GuildMember|null = (new ClientSearch()).getGuildMemberFromUser(reactionOrigin.message.guild, <User>user);

            if(member == null)
            {
                return;
            }

            embedMessage.removeDamage(member);
        }

        reactionOrigin.message.edit({embeds: [embedMessage.getEmbed()]});

        console.log(`reaction removed by ${member.displayName}`);
    }

    getFreeSpots(fields: EmbedField[], job: string, member: GuildMember) {        
        let field: EmbedField | undefined;

        let jobRegex = new RegExp(`^.*${job.toLocaleLowerCase()}.*$`, 'ig');      

        for(let i = 0; i < fields.length; i++){
            if(jobRegex.test(fields[i].name)){
                field = fields[i];
            }
        }

        if(typeof field == 'undefined'){
            return 0;
        }

        let freeSpots = field.value.split('\n').filter(e => e == '-');

        if(freeSpots.length == 0){
            return 0;
        }
    }
};