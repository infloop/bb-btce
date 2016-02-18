'use strict';

var co = require('co');
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
        var self = this;
        try {
            co(function*() {
                yield self.storage.save(point.toObject());
            }).then(function (val) {
                return cb();
            }, function (err) {
                console.log(err);
                return cb();
            });
        } catch(e) {
            return cb();
        }

    }

    _flush (cb) {
        cb();
    };
}

module.exports = BBStorageSink;