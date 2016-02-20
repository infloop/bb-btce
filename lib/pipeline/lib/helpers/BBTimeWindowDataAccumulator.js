'use strict';

var _ = require('lodash');
var BBDataAccumulator = require('./BBDataAccumulator');

class BBTimeWindowDataAccumulator extends BBDataAccumulator {
    constructor(timeWindow) {
        super();

        /** @type {number} */
        this.timeWindow = timeWindow;
    }

    /**
     * @param {BBPipelinePoint} point
     */
    push(point) {
        if(point.timestamp <= 0) {
            return;
        }

        let lastOldestTime = (point.timestamp - this.timeWindow);

        this.data.push(point);

        var oldestPoint = this.getFirstElement();
        while(true) {
            if(!oldestPoint) {
                break;
            }

            if(oldestPoint.timestamp < lastOldestTime) {
                this.data.shift();
                oldestPoint = this.getFirstElement();
            } else {
                break;
            }
        }
    }
}

module.exports = BBTimeWindowDataAccumulator;