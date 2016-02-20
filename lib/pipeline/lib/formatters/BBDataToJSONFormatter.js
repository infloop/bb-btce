'use strict';

var _ = require('lodash');
var stream = require('stream');

class BBDataToJSONFormatter extends stream.Transform {
    constructor() {
        super();

        this._readableState.objectMode = true;
        this._writableState.objectMode = true;
    }

    _transform(chunk, encoding, cb) {
        try {
            var data = JSON.stringify(chunk)+'\r\n';
            this.push(data);
        } catch(e) {

        }
        cb();
    }

    _flush (cb) {
        cb();
    }
}

module.exports = BBDataToJSONFormatter;