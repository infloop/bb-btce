'use strict';

var _ = require('lodash');
var co = require('co');
var BBDataTickerStream = require('../pipeline/BBDataTickerStream');
var BBCurrencies = require('./BBCurrencies');
var BBPipelinePoint = require('../pipeline/BBPipelinePoint');

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

        /**
         * @type {BBDataTickerStream}
         */
        this.stream = new BBDataTickerStream();
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

    /**
     * @param {BBDataTickerStream} stream
     */
    setStream(stream) {
        this.stream = stream;
    };

    /**
     * @returns {BBDataTickerStream}
     */
    getStream() {
        return this.stream;
    };

    getPoint() {
        return (new BBPipelinePoint({
            _tag00: this.config.tag.value,
            _tag01: 'pair',
            _tag02: this.tradePairName,
            _tag03: this.sourceCurrency,
            _tag04: this.destCurrency,

            fee: this.fee,
            bids: this.bids,
            asks: this.asks
        }, this.timestamp));
    }

    *save() {
        yield this.storage.save(this.getPoint());
    };

    * refresh() {
        //console.log('refreshing pair:' + this.tradePairName);

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



        this.stream.tick(this.getPoint());
    }
}

module.exports = BBTradePair;