'use strict';

var _ = require('lodash');
var stream = require('stream');

class BBDataFilter extends stream.Transform {
    constructor(filter) {
        super();

        var self = this;
        if(!_.isFunction(filter)) {
            filter = function(data, encoding, cb) { self.push(data); cb(); }
        }

        this.filter = filter.bind(this);

        this._readableState.objectMode = true;
        this._writableState.objectMode = true;
    }

    _transform(point, encoding, cb) {
        this.filter(point, encoding, cb);
    }

    _flush (cb) {
        cb();
    };
}

module.exports = BBDataFilter;