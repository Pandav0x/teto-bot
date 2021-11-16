import { MessageEmbed, User } from 'discord.js';
import DateTools from './DateTools';
import { Emoji } from './Emoji';

export default class PFEmbedBuilder {

    title: string;

    tanks: User[];
    tanksNumber: number;

    healers: User[];
    healersNumber: number;

    damages: User[];
    damagesNumber: number;

    color: PFEmbedColor;

    date: Date;

    footer: string|null;

    hasTimestamp: boolean;

    thumbnail: string;

    description: string;
    
    constructor(){
        this.title = 'Title';
        this.tanks = [];
        this.tanksNumber = 0;
        this.healers = [];
        this.healersNumber = 0;
        this.damages = [];
        this.damagesNumber = 0;
        this.color = PFEmbedColor.PENDING;
        this.date = new Date();
        this.footer = null;
        this.hasTimestamp = true;
        this.thumbnail = 'https://static.wikia.nocookie.net/nausicaa/images/a/a4/Fox_squirrel.gif/revision/latest?cb=20100605225647';
        this.description = 'Your group is looking for the following members:';
    }

    getEmbed(): MessageEmbed {

        let dt = new DateTools();

        let embed: MessageEmbed = new MessageEmbed();

        embed.setTitle(this.title)
            .setColor(this.color)
            .setDescription(this.description)
            .setThumbnail(this.thumbnail)
            .addField('Time', `On the **${dt.formatDate(this.date)}** at **${dt.timeTo12Hours(this.date.getUTCHours())} ST**`);

        if(this.tanksNumber !== 0){
            embed.addField(`${ Emoji.TANK } Tanks`, this.getTanksField(), true);
        }

        if(this.healersNumber !== 0){
            embed.addField(`${ Emoji.HEALER } Healers`, this.getHealersField(), true);
        }

        if(this.damagesNumber !== 0){
            embed.addField(`${ Emoji.DPS } Dps`, this.getDamagesField(), true);
        }

        if(this.hasTimestamp){
            embed.setTimestamp();
        }

        if(this.footer !== null) {
            embed.setFooter(this.footer);
        }

        return embed;
    }

    setTitle(title: string): PFEmbedBuilder {
        this.title = title;
        return this;
    }

    setTanksNumber(number: number): PFEmbedBuilder {
        this.tanksNumber = number;
        return this;
    }

    setHealersNumber(number: number): PFEmbedBuilder {
        this.healersNumber = number;
        return this;
    }

    setDamagesNumber(number: number): PFEmbedBuilder{
        this.damagesNumber = number;
        return this;
    }

    setTHDNumbers(tanksNumber: number, healersNumber: number, damagesNumber: number): PFEmbedBuilder {
        this.tanksNumber = tanksNumber;
        this.healersNumber = healersNumber;
        this.damagesNumber = damagesNumber;
        return this;
    }

    setDate(date: Date): PFEmbedBuilder {
        this.date = date;
        return this;
    }

    setFooter(footer: string): PFEmbedBuilder {
        this.footer = footer;
        return this;
    }

    addTank(user: User) {
        if(this.tanks.length < this.tanksNumber && !this.tanks.includes(user)){
            this.tanks.push(user);
        }
    }

    removeTank(user: User) {
        if(this.tanks.includes(user)){
            this.tanks = this.tanks.filter(u => u !== user);
        }
    }

    addHealer(user: User){
        if(this.healers.length < this.healersNumber && !this.healers.includes(user)){
            this.healers.push(user);
        }
    }

    removeHealer(user: User){
        if(this.healers.includes(user)){
            this.healers = this.healers.filter(u => u !== user);
        }
    }

    addDamage(user: User){        
        if(this.damages.length < this.damagesNumber && !this.damages.includes(user)){
            this.damages.push(user);
        }
    }
    
    removeDamage(user: User){
        if(this.damages.includes(user)){
            this.damages = this.damages.filter(u => u !== user);
        }
    }

    getTanksField(): string {
        return this.getSpotsString(this.tanks, this.tanksNumber);
    }

    getHealersField(): string {
        return this.getSpotsString(this.healers, this.healersNumber);
    }

    getDamagesField(): string {
        return this.getSpotsString(this.damages, this.damagesNumber);
    }

    getSpotsString(jobSpotsTaken: User[], jobSpotsMax: number): string {
        let spots: Array<string> = jobSpotsTaken.map(u => { return u.username });
        let leftoverSpots: Array<string> = new Array<string>(jobSpotsMax - jobSpotsTaken.length).fill('-');
        return [...spots, ...leftoverSpots].join('\n');
    }
}

enum PFEmbedColor {
    PENDING = '#0099ff',
    SUCCESS = '#63f542',
    FAILURE = '#f54242'
}