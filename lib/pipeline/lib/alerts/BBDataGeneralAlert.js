'use strict';

var _ = require('lodash');
var BBStreamFilter = require('../filters/BBStreamFilter');

class BBDataGeneralAlert extends BBStreamFilter {
    constructor() {
        super();
    }
}

module.exports = BBDataGeneralAlert;