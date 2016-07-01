'use strict';

var _ = require('lodash');
var BBDataFilter = require('./BBStreamFilter');

class BBEventNameFilter extends BBDataFilter {
    constructor(eventName) {
        super();

        this.eventName = eventName;
        this.localKey = this.constructor.name + ':ev:' + this.eventName;
    }

    filter(point, encoding, cb) {
        this.addToNodesList(point);

        if(point.data.event_name === this.eventName) {



            this.push(point);
        }
        cb();
    }

}

module.exports = BBEventNameFilter;