'use strict';

var _ = require('lodash');
var BBDataFilter = require('../filters/BBStreamFilter');

class BBDataAccumulatorByTimeWindow extends BBDataFilter {

    /**
     * @param {BBTimeWindowDataAccumulator} accumulator Seconds in the past
     */
    constructor(accumulator) {
        super();

        /** @type {BBTimeWindowDataAccumulator} */
        this.accumulator = accumulator;
    }

    /**
     * @param {BBPipelinePoint} point
     * @param encoding
     * @param {function} cb
     */
    filter(point, encoding, cb) {
        self.accumulator.push(point);
        self.push(point);
        cb();
    };
}

module.exports = BBDataAccumulatorByTimeWindow;