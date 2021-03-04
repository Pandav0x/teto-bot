'use strict';

module.exports = class FreeCompany {
    id = null;
    name = null;
    server = null;
    slogan = null;
    grandCompany = null;
    createdAt = null;
    rank = null;
    lastUpdate = null;
    ranking = null;
    estate = null;

    constructor(id, name, server, slogan, grandCompany, createdAt, rank, lastUpdate, ranking, estate){
        this.id = id;
        this.name = name;
        this.server = server;
        this.slogan = slogan;
        this.grandCompany = grandCompany;
        this.createdAt = new Date(createdAt * 1000).toISOString();
        this.rank = rank;
        this.lastUpdate = new Date(lastUpdate * 1000).toISOString();
        this.ranking = ranking;
        this.estate = estate;
    }

    toString(){
        return this.name;
    }

    getMonthlyRanking(){
        return this.ranking.Monthly;
    }

    getWeeklyRanking(){
        return this.ranking.Weekly;
    }
};