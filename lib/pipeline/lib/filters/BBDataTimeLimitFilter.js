'use strict';

var _ = require('lodash');
var BBDataFilter = require('./BBDataFilter');

class BBDataTimeLimitFilter extends BBDataFilter {
    constructor(timeInterval, maxNumber) {
        super();

        this.timeInterval = timeInterval;
        this.maxNumber = maxNumber;

        this.lastPointTime = 0;
        this.number = 0;
    }

    filter(point, encoding, cb) {
        if((Date.now() - this.lastPointTime) >=  this.timeInterval) {
            this.number = 0;
            this.lastPointTime = Date.now();
        }

        if(this.number >= this.maxNumber) {
            return cb();
        }

        this.push(point);

        this.number++;
        cb();
    }

}

module.exports = BBDataTimeLimitFilter;