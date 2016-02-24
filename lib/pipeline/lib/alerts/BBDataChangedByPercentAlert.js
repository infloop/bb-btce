'use strict';

var _ = require('lodash');
var BBDataGeneralAlert = require('./BBDataGeneralAlert');

class BBDataValueChangedByPercentAlert extends BBDataGeneralAlert {
    /**
     * @param {BBPointValueExtractor} valueExtractorFn
     * @param {number} percent
     * @param {number} maxTimeBack
     * @param {BBIStorage} storage
     */
    constructor(valueExtractorFn, percent, maxTimeBack, storage) {
        super();

        if(!_.isFunction(valueExtractorFn)) {
            throw new TypeError("'valueExtractorFn' must be a function");
        }

        /** @type {BBIStorage} */
        this.storage = storage;

        /** @type {number} */
        this.percent = percent;
    }

    /**
     * @param {BBPipelinePoint} point
     * @param encoding
     * @param {function} cb
     */
    filter(point, encoding, cb) {

        cb();
    }
}

module.exports = BBDataValueChangedByPercentAlert;