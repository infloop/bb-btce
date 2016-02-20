'use strict';

var _ = require('lodash');
var BBDataGeneralAlert = require('./BBDataGeneralAlert');

class BBDataValueChangedByPercentAlert extends BBDataGeneralAlert {
    /**
     * @param {BBPointValueExtractor} valueExtractorFn
     * @param {number} percent
     * @param {BBTimeWindowDataAccumulator} accumulator
     */
    constructor(valueExtractorFn, percent, accumulator) {
        super();

        if(!_.isFunction(valueExtractorFn)) {
            throw new TypeError("'valueExtractorFn' must be a function");
        }

        /** @type {BBTimeWindowDataAccumulator} */
        this.accumulator = accumulator;

        /** @type {number} */
        this.percent = percent;
    }
}

module.exports = BBDataValueChangedByPercentAlert;