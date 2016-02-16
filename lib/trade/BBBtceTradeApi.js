'use strict';

var BBITradeAPI = require('./BBITradeAPI');
var Promise = require("bluebird");
var BTCE = require('btc-e');
var config = require('../config');
var co = require('co');

class BBBtceTradeApi extends BBITradeAPI {

    constructor() {
        super();
    }

    * initialize(config) {
        super.initialize(config);
        var btce = new BTCE(this.config.btce.key, this.config.btce.secret);
        //btce.url = 'https://btc-e.nz/tapi';
        //btce.publicApiUrl = 'https://btc-e.nz/api/2/';
        this.btce = Promise.promisifyAll(btce);
    }

    * depth(pair) {
        return this.btce.depthAsync(pair);
    }

    * getInfo(pair) {
        return this.btce.getInfoAsync(pair);
    }

    * fee(pair) {
        return this.btce.feeAsync(pair);
    }
}

module.exports = BBBtceTradeApi;

if(require.main === module) {

    var btceTradeApi = new BBBtceTradeApi();

    co(function*() {
        yield btceTradeApi.initialize(config);
        return yield btceTradeApi.depth('ltc_rur');
    }).then(function (val) {
        console.log(val);
    }, function (err) {
        console.log(err);
    });
}