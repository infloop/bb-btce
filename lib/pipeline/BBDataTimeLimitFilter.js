'use strict';

var _ = require('lodash');
var stream = require('stream');

class BBDataTimeLimitFilter extends stream.Transform {
    constructor(timeInterval, maxNumber) {
        super();

        this.timeInterval = timeInterval;
        this.maxNumber = maxNumber;

        this.lastPointTime = 0;
        this.number = 0;

        this._readableState.objectMode = true;
        this._writableState.objectMode = true;
    }

    _transform(point, encoding, cb) {
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

    _flush (cb) {
        cb();
    };
}

module.exports = BBDataTimeLimitFilter;