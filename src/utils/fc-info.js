'use strict';

const fetch = require('node-fetch');
const FreeCompany = require('../entities/free-company');

module.exports = {
    _getId: async (server, name) => {
        let searchResponse = await fetch(`https://xivapi.com/freecompany/search?name=${name}&server=${server}`);
        let searchJson = await searchResponse.json();

        if(searchJson.Results.length === 0){
            return null;
        }

        return searchJson.Results[0].ID;
    },

    _getFreeCompany: async (id) => {
        let response = await fetch(`https://xivapi.com/freecompany/${id}?data=FCM`);
        let json = await response.json();

        if(json.hasOwnProperty('Error') && json.Error === true){
            return null;
        }

        return new FreeCompany(
            id,
            json.FreeCompany.Name,
            json.FreeCompany.Server,
            json.FreeCompany.Slogan,
            json.FreeCompany.GrandCompany,
            json.FreeCompany.Formed,
            json.FreeCompany.Rank,
            json.FreeCompany.ParseDate,
            json.FreeCompany.Ranking,
            json.FreeCompany.Estate
        );
    },

    getFreeCompany: async (server, name) => {
        let fcID = await module.exports._getId(server, name);

        if(fcID === null){
            return null;
        }

        return await module.exports._getFreeCompany(fcID);
    }
};