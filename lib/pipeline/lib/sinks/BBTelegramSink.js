'use strict';

var co = require('co');
var _ = require('lodash');
var stream = require('stream');

class BBTelegramSink extends stream.Writable {
    /**
     *
     * @param {TelegramService} telegramService
     */
    constructor(telegramService) {
        super();

        /** @type {TelegramService} */
        this.telegramService = telegramService;

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
                yield self.telegramService.sendMessage(point.toObject());
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
    }
}

module.exports = BBTelegramSink;