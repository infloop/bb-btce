'use strict';

var _ = require('lodash');
var co = require('co');
var BBMarket = require('./lib/trade/BBMarket');
var BBTradePair = require('./lib/trade/BBTradePair');
var BBCurrencies = require('./lib/trade/BBCurrencies');
var BBMongoStorage = require('./lib/storage/BBMongoStorage');
var BBBtceTradeAPI = require('./lib/trade/BBBtceTradeAPI');
var config = require('./lib/config');

var marketBTCE = new BBMarket('BTC-E');
var tradeAPI = new BBBtceTradeAPI();
var storage = new BBMongoStorage();



co(function*() {
    yield tradeAPI.initialize(config);
    yield storage.initialize(config);
    yield marketBTCE.initialize(config);

    marketBTCE.setTradeOperator(tradeAPI);

    var pairs = [];
    _.forIn(config.pairs, function(pairConfig, pairName) {
        let pair = new BBTradePair(pairName, pairConfig.source, pairConfig.destination);
        pairs.push(pair);
    });

    for(let pair of pairs) {
        yield pair.initialize(config);
        pair.setStorage(storage);
        marketBTCE.addPair(pair);
    }

    yield marketBTCE.refresh();
}).then(function (val) {
    console.log(val);
}, function (err) {
    console.log(err);
});

