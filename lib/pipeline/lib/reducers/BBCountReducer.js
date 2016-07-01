'use strict';

var _ = require('lodash');
var BBDataFilter = require('./../filters/BBStreamFilter');
var redis = require('../redis-like/redis');

class BBCountReducer extends BBDataFilter {
    constructor(valueToCountPath, maxCount, aggregateFields) {
        super();

        this.valueToCountPath = valueToCountPath;
        this.maxCount = maxCount;
        if(!_.isArray(aggregateFields)) {
            aggregateFields = [aggregateFields];
        }
        this.aggregateFields = aggregateFields;
        this.localKey = this.constructor.name;
    }
    
    

    filter(point, encoding, cb) {
        this.addToNodesList(point);
        
        let valueToSum = _.at(point.data, this.valueToCountPath);
        let valueToAggregate = _.at(point.data, this.aggregateFields[0]);

        let lastKeys = point._previousNodeKeys.join('|');

        let redisKey = lastKeys + ':' + this.aggregateFields[0] + ':' + valueToAggregate;
        let redisCounterKey = redisKey +':count';

        if(!this.isProcessedAlready(point, redisKey)) {
            redis[redisCounterKey] = redis[redisCounterKey] || 0;
            redis[redisCounterKey] ++;
            this.setProcessed(point, redisKey);
        }

        if(redis[redisCounterKey] >= this.maxCount) {
            this.push(point);
        }

        cb();
    }

}

module.exports = BBCountReducer;