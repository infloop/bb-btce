'use strict';

var _ = require('lodash');
var stream = require('stream');


class BBDataFilter extends stream.Transform {
    constructor(filter) {
        super();

        var self = this;
        if(_.isFunction(filter)) {
            this.filter = filter.bind(this);
        } else if(!_.isFunction(this.filter) && !_.isFunction(filter)) {
            filter = function() {  }
            this.filter = filter.bind(this);
        }

        this._readableState.objectMode = true;
        this._writableState.objectMode = true;
    }

    /**
     * @param {BBPipelinePoint} point
     * @param encoding
     * @param {function} cb
     */
    filter(point, encoding, cb) {
        this.push(point);
        cb();
    }

    _transform(point, encoding, cb) {
        this.filter(point, encoding, cb);
    }

    _flush (cb) {
        cb();
    }
}

module.exports = BBDataFilter;