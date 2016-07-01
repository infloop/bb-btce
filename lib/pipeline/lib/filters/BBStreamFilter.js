'use strict';

var _ = require('lodash');
var stream = require('stream');
var BBPipelinePoint = require('../BBPipelinePoint');
var redis = require('../redis-like/redis');

class BBStreamFilter extends stream.Transform {
    constructor(filter) {
        super();

        var self = this;
        if(_.isFunction(filter)) {
            this.filter = filter.bind(this);
        } else if(!_.isFunction(this.filter) && !_.isFunction(filter)) {
            filter = function() {  };
            this.filter = filter.bind(this);
        }

        this._readableState.objectMode = true;
        this._writableState.objectMode = true;

        this.localKey = '';
    }

    setProcessed(point, key) {
        redis[key] = redis[key] || {};
        redis[key]['seq'] = redis[key]['seq'] || {};
        redis[key]['seq'][point.data.sqId] = 1;
    }

    isProcessedAlready(point, key) {
        return !!(redis[key] && redis[key]['seq'] && redis[key]['seq'][point.data.sqId]);
    }

    addToNodesList(point) {
        point._previousNodeKeys = point._previousNodeKeys || [];
        point._previousNodeKeys.push(this.localKey);

        //point._previousNodes = point._previousNodes || [];
        //point._previousNodes.push(_.clone(_.pick(this, _.keys(this))));
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

module.exports = BBStreamFilter;