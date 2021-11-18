import { EmbedField, MessageEmbed, GuildMember, Guild, User } from 'discord.js';
import BaseConverter from './BaseConverter';
import ClientSearch from './ClientSearch';
import DateTools from './DateTimeFormatter';
import { Emoji } from './Emoji';
import MessageHelper from './MessageHelper';

export default class PFEmbedBuilder {

    static guild: Guild|null;

    title: string;

    tanks: GuildMember[];
    tanksNumber: number;

    healers: GuildMember[];
    healersNumber: number;

    damages: GuildMember[];
    damagesNumber: number;

    color: PFEmbedColor;

    date: Date;

    footer: string|null;

    hasTimestamp: boolean;

    thumbnail: string;

    description: string;
    
    //TODO - remove guild and assign it through a method (?)
    constructor(guild: Guild|null){
        PFEmbedBuilder.guild = guild;
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

        if(this.tanksNumber != 0){
            embed.addField(`${ Emoji.TANK } Tanks`, this.getTanksField(), true);
        }

        if(this.healersNumber != 0){
            embed.addField(`${ Emoji.HEALER } Healers`, this.getHealersField(), true);
        }

        if(this.damagesNumber != 0){
            embed.addField(`${ Emoji.DPS } Dps`, this.getDamagesField(), true);
        }

        if(this.hasTimestamp){
            embed.setTimestamp();
        }

        if(this.footer != null) {
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

    setColor(color: string): PFEmbedBuilder {
        if((<any>Object).values(PFEmbedColor).includes(color)){
            this.color = <any>color as PFEmbedColor;
        }
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

    addTank(member: GuildMember) {
        if(this.tanks.length < this.tanksNumber && !this.tanks.includes(member)){
            this.tanks.push(member);
        }
    }

    addTanks(members: Array<GuildMember>): PFEmbedBuilder {
        for(let i = 0; i< members.length; i++){
            this.addTank(members[i]);
        }
        return this;
    }

    removeTank(member: GuildMember) {
        if(this.tanks.includes(member)){
            this.tanks = this.tanks.filter(m => m != member);
        }
    }

    addHealer(member: GuildMember){
        if(this.healers.length < this.healersNumber && !this.healers.includes(member)){
            this.healers.push(member);
        }
    }

    addHealers(members: Array<GuildMember>): PFEmbedBuilder {
        for(let i = 0; i< members.length; i++){
            this.addHealer(members[i]);
        }
        return this;
    }

    removeHealer(member: GuildMember){
        if(this.healers.includes(member)){
            this.healers = this.healers.filter(m => m != member);
        }
    }

    addDamage(member: GuildMember){        
        if(this.damages.length < this.damagesNumber && !this.damages.includes(member)){
            this.damages.push(member);
        }
    }

    addDamages(members: Array<GuildMember>): PFEmbedBuilder {
        for(let i = 0; i< members.length; i++){
            this.addDamage(members[i]);
        }
        return this;
    }
    
    removeDamage(member: GuildMember){
        if(this.damages.includes(member)){
            this.damages = this.damages.filter(m => m != member);
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

    getSpotsString(jobSpotsTaken: GuildMember[], jobSpotsMax: number): string {
        let spots: Array<string> = jobSpotsTaken.map(m => { return (new MessageHelper()).getMentionFromMember(m) });
        let leftoverSpots: Array<string> = new Array<string>(jobSpotsMax - jobSpotsTaken.length).fill('-');
        return [...spots, ...leftoverSpots].join('\n');
    }

    static instanciateFromMessage(guild: Guild|null, message: MessageEmbed): PFEmbedBuilder {
        
        let embed = new PFEmbedBuilder(guild);

        let [tanksNumber, healersNumber, damagesNumber] = this.getTHDNumbers(message.fields);
        
        embed.setTitle(message.title ?? 'Title')
            .setColor(`#${(new BaseConverter().dec2hex(message.color ?? 0, 6))}`)
            .setFooter(message.footer?.text ?? '')
            .setDate(PFEmbedBuilder.getDateFromField(message.fields))
            .setTHDNumbers(tanksNumber, healersNumber, damagesNumber)
            .addTanks(PFEmbedBuilder.getMembersForSpot(message.fields, 'tank'))
            .addHealers(PFEmbedBuilder.getMembersForSpot(message.fields, 'healer'))
            .addDamages(PFEmbedBuilder.getMembersForSpot(message.fields, 'dps'));

        return embed;
    }

    static getDateFromField(fields: EmbedField[]): Date {
        for(let i = 0; i < fields.length; i++){
            if(fields[i].name.toLowerCase() == 'time'){
                let regex = new RegExp('(?<=(\\*\\*))(?!\\sat\\s)([a-zA-z0-9\\s,])+?(?=(\\*\\*))', 'ig');
                
                let matches: IterableIterator<RegExpMatchArray> = fields[i].value.matchAll(regex);

                let [date, unformatedTime] = [...matches].map(e => { return e[0] });

                let time = (new DateTools()).timeTo24Hours(unformatedTime.slice(0, -3));

                return new Date(`${date} ${time} GMT+0:00`);
            }
        }
        return new Date();
    }

    static getTHDNumbers(fields: EmbedField[]): Array<number> {
        let [tanksNumber, healersNumber, damagesNumber] = [0, 0, 0];
        
        for(let i = 0; i < fields.length; i++){

            if(fields[i].name.toLowerCase().includes('tank')){
                tanksNumber = fields[i].value.split('\n').length;
            }

            if(fields[i].name.toLowerCase().includes('healer')){
                healersNumber = fields[i].value.split('\n').length;
            }

            if(fields[i].name.toLowerCase().includes('dps')){
                damagesNumber = fields[i].value.split('\n').length;
            }
        }

        return [tanksNumber, healersNumber, damagesNumber];
    }

    static getMembersForSpot(fields: EmbedField[], spotName: string){

        let clientSearch: ClientSearch = new ClientSearch();

        let spotsTaken: Array<GuildMember> = new Array<GuildMember>();
        
        for(let i = 0; i < fields.length; i++){
            if(fields[i].name.toLowerCase().includes(spotName.toLowerCase())){
                let spots = fields[i].value.split('\n');
                for(let j = 0; j < spots.length; j++){
                    if(spots[j] != '-'){
                        let memberId = (new MessageHelper()).getMemberIdFromMention(spots[j]);

                        let user: User|null = clientSearch.getUserById(memberId);

                        if(user == null){
                            continue;
                        }
                        
                        let member: GuildMember|null = clientSearch.getGuildMemberFromUser(PFEmbedBuilder.guild, user);

                        if(member == null){
                            continue;
                        }

                        spotsTaken.push(member);
                    }
                }
            }
        }

        return spotsTaken;
    }
}

enum PFEmbedColor {
    PENDING = <any>'#0099ff',
    SUCCESS = <any>'#63f542',
    FAILURE = <any>'#f54242'
}