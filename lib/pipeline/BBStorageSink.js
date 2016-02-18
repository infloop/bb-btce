'use strict';

var _ = require('lodash');
var stream = require('stream');

class BBStorageSink extends stream.Writable {
    /**
     *
     * @param {BBIStorage} storage
     */
    constructor(storage) {
        super();

        /** @type {BBIStorage} */
        this.storage = storage;

        this._writableState.objectMode = true;
    }

    /**
     *
     * @param {BBPipelinePoint} point
     * @param encoding
     * @param {Function} cb
     * @private
     */
    _write(point, encoding, cb) {
        try {
            this.storage.save(point.toObject())
        } catch(e) {

        }
        cb();
    }

    _flush (cb) {
        cb();
    };
}

module.exports = BBStorageSink;