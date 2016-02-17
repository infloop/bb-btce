'use strict';

var _ = require('lodash');
var co = require('co');
var BBCurrencies = require('./BBCurrencies');

class BBTradePair {

    /**
     *
     * @param name
     * @param sourceCurrency
     * @param destCurrency
     * @param tradeOperator
     */
    constructor(name, sourceCurrency, destCurrency, tradeOperator) {
        /** @type {String} */
        this.name = name;

        /** @type {BBITradeAPI} */
        this.tradeOperator = tradeOperator || null;

        /** @type {String} */
        this.sourceCurrency = sourceCurrency;

        /** @type {String} */
        this.destCurrency = destCurrency;

        /** @type {String} */
        this.tradePairName = name;

        /** @type {BBIStorage} */
        this.storage = null;

        /** @type {Object} */
        this.config = null;

        /** @type {Array} */
        this.bids = [];

        /** @type {Array} */
        this.asks = [];

        /** @type {number} */
        this.fee = 0;

        /** @type {null} */
        this.timestamp = null;
    }

    * initialize(config) {
        this.config = config;
    };

    /**
     * @param {BBITradeAPI} tradeOperator
     */
    setTradeOperator(tradeOperator) {
        this.tradeOperator = tradeOperator;
    };

    /**
     * @param {BBIStorage} storage
     */
    setStorage(storage) {
        this.storage = storage;
    };

    *save() {
        var data = {
            _tag00: this.config.tag.value,
            _tag01: 'pair',
            _tag02: this.tradePairName,
            _timestamp: this.timestamp,

            fee: this.fee,
            bids: this.bids,
            asks: this.asks
        };

        yield this.storage.save(data);
    };

    * refresh() {
        var depth = yield this.tradeOperator.depth(this.tradePairName);
        var fee = yield this.tradeOperator.fee(this.tradePairName);

        this.bids =_.sortBy(depth.bids, function(bid) {
            return -bid[0];
        });

        this.asks =_.sortBy(depth.asks, function(ask) {
            return ask[0];
        });

        this.timestamp = Date.now();
        this.fee = fee.trade/100;

        yield this.save();
    }
}

module.exports = BBTradePair;