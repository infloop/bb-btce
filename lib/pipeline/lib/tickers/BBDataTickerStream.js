'use strict';

var _ = require('lodash');
var stream = require('stream');
var BBPipelinePoint = require('./../BBPipelinePoint');

class BBDataTickerStream extends stream {
    constructor() {
        super();
        this.readable = true;
    }

    /**
     * @param {BBPipelinePoint } point
     */
    tick(point) {
        if(!(point instanceof BBPipelinePoint)) {
            throw new TypeError('DataTicker can emit only BBPipelinePoint type objects');
        }

        this.emit('data', point);
    }

    end() {
        this.emit('end');
    }
}

module.exports = BBDataTickerStream;