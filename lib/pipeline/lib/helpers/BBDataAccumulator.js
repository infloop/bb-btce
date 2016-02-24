'use strict';

var _ = require('lodash');
var BBDataFilter = require('../filters/BBStreamFilter');

class BBDataAccumulator {
    constructor() {
        /**
         * @type {Array<BBPipelinePoint>}
         */
        this.data = [];
    }

    /**
     * @param {BBPipelinePoint} point
     */
    push(point) {
        this.data.push(point);
    }

    /**
     * @public
     * @returns {BBPipelinePoint|undefined}
     */
    getFirstElement() {
        return this.data[0];
    }

    /**
     * @public
     * @returns {Array.<BBPipelinePoint>|Array}
     */
    getData() {
        return this.data;
    }

    clear() {
        this.data = [];
    }
}

module.exports = BBDataAccumulator;