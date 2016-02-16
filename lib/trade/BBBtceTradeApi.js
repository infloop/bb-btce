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

    initialize(config) {
        super.initialize(config);
        var btce = new BTCE(this.config.btce.key, this.config.btce.secret);
        btce.url = 'https://btc-e.nz/tapi';
        btce.publicApiUrl = 'https://btc-e.nz/api/2/';
        this.btce = Promise.promisifyAll(btce);
    }

    * ticker() {
        yield this.btce.tickerAsync();
    }

    * getInfo() {
        yield this.btce.getInfoAsync();
    }
}

module.exports = BBBtceTradeApi;

if(require.main === module) {

    var btceTradeApi = new BBBtceTradeApi();

    co(function*() {
        yield btceTradeApi.initialize();
        yield btceTradeApi.ticker();
    }).then(function (val) {
        console.log(val);
    }, function (err) {
        console.log(err);
    });



}