'use strict';

var _ = require('lodash');
var BBDataGeneralAlert = require('./BBDataGeneralAlert');


class BBDataValueConditionAlert extends BBDataGeneralAlert {
    /**
     * @param {BBPointValueExtractor} valueExtractorFn
     * @param {String} condition
     * @param {*} value
     */
    constructor(valueExtractorFn, condition, value) {
        super();

        var self = this;

        if(!_.isFunction(valueExtractorFn)) {
            throw new TypeError("'valueExtractorFn' must be a function");
        }

        /** @type {BBPointValueExtractor} */
        this.valueExtractorFn = valueExtractorFn
    }

    /**
     * @param {BBPipelinePoint} point
     * @param encoding
     * @param {function} cb
     */
    filter(point, encoding, cb) {
        let extractedValue = this.valueExtractorFn(point);

        switch (condition) {
            case '>=':
                if(extractedValue >= value) {
                    this.push(data);
                }
                break;
            case '>':
                if(extractedValue > value) {
                    this.push(data);
                }
                break;
            case '<=':
                if(extractedValue <= value) {
                    this.push(data);
                }
                break;
            case '<':
                if(extractedValue < value) {
                    this.push(data);
                }
                break;
            case '==':
                if(extractedValue == value) {
                    this.push(data);
                }
                break;
            default:
                break;
        }

        cb();
    }
}

module.exports = BBDataValueConditionAlert;