'use strict';

var _ = require('lodash');
var BBDataFilter = require('./BBStreamFilter');

var redis = require('../redis-like/redis');

class BBDailyFilter extends BBDataFilter {
    constructor(maxDays) {
        super();

        this.maxDays = maxDays;
        this.localKey = this.constructor.name;
    }

    filter(point, encoding, cb) {
        let daysMax = this.maxDays;

        this.addToNodesList(point);

        let lastKeys = point._previousNodeKeys.join('|');
        
        let userId = point.data.user_id;
        let userAwareKey = lastKeys + ':userId:' + userId;
        let keyLastDay = userAwareKey + ':lastDay';
        let keyNumberOfDays = userAwareKey + ':numberOfDays';

        let eventDayNumber = point.data.day;
        let prevEventDayNumber = redis[keyLastDay] || 0;

        if(!this.isProcessedAlready(point, userAwareKey)) {
            if(prevEventDayNumber == 0) {
                // No actions in the past
                // Just set the current day number
                redis[keyLastDay] = eventDayNumber;
                return cb();
            } else if(prevEventDayNumber == eventDayNumber) {
                // The same day - do nothing
                return cb();
            }

            if(prevEventDayNumber == eventDayNumber - 1){
                // set last day number
                redis[keyLastDay] = eventDayNumber;
                // yesterday - increment counter
                redis[keyNumberOfDays] = redis[keyNumberOfDays] || 0;
                redis[keyNumberOfDays]++;
                this.setProcessed(point, userAwareKey);
            } else {
                redis[keyLastDay] = eventDayNumber;
                redis[keyNumberOfDays] = 0;
            }
        }
        
        if (redis[keyNumberOfDays] == daysMax) {
            this.push(point);
        } else if (redis[keyNumberOfDays] >= daysMax) {
            // do nothing
        }
        cb();
    }

}

module.exports = BBDailyFilter;