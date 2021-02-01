'use strict';

const redis = require('redis');

module.exports = class RedisCacheStrategy {
    _redisClient = null;
    constructor(){
        this._redisClient = redis.createClient(process.env.REDIS_URL);
    }

    get(key){
        return this._redisClient.get(key)
    }

    set(key, value){
        return this._redisClient.set(key, value);
    }
};