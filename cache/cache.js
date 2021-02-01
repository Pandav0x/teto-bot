'use strict';

const CacheStrategyEnum = require('./cache-strategy-enum');

module.exports = class Cache {
    _cacheStrategy = null;
    constructor(flag = CacheStrategyEnum.none){
        switch(flag){
            case CacheStrategyEnum.filesystem:
                this._cacheStrategy = new (require('./strategies/file-cache-strategy'))();
                break;
            case CacheStrategyEnum.redis:
                if(process.env.REDIS_URL !== ''){
                    this._cacheStrategy = new (require('./strategies/redis-cache-strategy'))();
                }
                break;
            case CacheStrategyEnum.none:
            default:
                break;
        }
    }

    get(key){
        if(this._cacheStrategy === null){
            return null;
        }
        return this._cacheStrategy.get(key);
    }

    set(key, value){
        if(this._cacheStrategy === null){
            return null;
        }
        return this._cacheStrategy.set(key, value);
    }
};