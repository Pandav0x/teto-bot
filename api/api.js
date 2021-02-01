'use strict';

const Cache = require('../cache/cache');
const CacheStrategyEnum = require('../cache/cache-strategy-enum');

module.exports = class API {
    _cacheClient = null;
    constructor(){
        this._cacheClient = new Cache(CacheStrategyEnum.redis);
    }
};