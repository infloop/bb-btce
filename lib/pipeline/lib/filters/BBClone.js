'use strict';

var _ = require('lodash');
var BBDataFilter = require('./BBStreamFilter');
var BBPipelinePoint = require('../BBPipelinePoint');

class BBClone extends BBDataFilter {
    constructor(eventName) {
        super();

        this.eventName = eventName;
        this.localKey = this.constructor.name + ':events:' + this.eventName;
    }

    filter(point, encoding, cb) {
        let data = _.cloneDeep(point.toObject());
        this.push(BBPipelinePoint.fromObject(data));
        cb();
    }

}

module.exports = BBClone;