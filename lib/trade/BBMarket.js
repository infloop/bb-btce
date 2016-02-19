'use strict';

var _ = require('lodash');
var BBDataFilter = require('../pipeline/BBDataFilter');
var BBTradePair = require('./BBTradePair');
/**
 *
 * @param {String} name
 * @constructor
 */
class BBMarket {

    constructor(name) {
        /** @type {String} */
        this.name = name;

        /** @type {BBITradeAPI} */
        this.tradeOperator = null;

        /** @type {Array<BBTradePair>} */
        this.pairs = [];

        /** @type {BBDataFilter} */
        this.stream = new BBDataFilter();
    }

    * initialize(config) {
        this.config = config;

        if(this.config.markets && this.config.markets[this.name]) {
            if(this.config.markets[this.name].tradeOperator === 'BBBtceTradeApi') {
                this.tradeOperator = new require('./BBBtceTradeApi')();
                yield this.tradeOperator.initialize(config);
            }

            var pairs = [];
            _.forIn(config.markets.pairs, function(pairConfig, pairName) {
                let pair = new BBTradePair(pairName, pairConfig.source, pairConfig.destination);
                pairs.push(pair);
            });

            for(let pair of pairs) {
                yield pair.initialize(config);
                this.addPair(pair);
            }
        }
    }

    /**
     *
     * @param {BBTradePair} pair
     */
    addPair(pair) {
        if (!pair.tradeOperator && this.tradeOperator) {
            pair.setTradeOperator(this.tradeOperator);
        }

        this.pairs.push(pair);

        pair.getStream().pipe(this.stream);
    }

    /**
     * @param {BBDataTickerStream} stream
     */
    setStream(stream) {
        //TODO make pairs auto piping
        this.stream = stream;
    };

    /**
     * @returns {BBDataTickerStream}
     */
    getStream() {
        return this.stream;
    };

    /**
     *
     * @param {BBITradeAPI} tradeOperator
     */
    setTradeOperator(tradeOperator) {
        if(this.pairs.length>0) {
            for(let pair of this.pairs) {
                pair.setTradeOperator(tradeOperator);
            }
        }

        this.tradeOperator = tradeOperator;
    };

    * refresh() {
        for(let pair of this.pairs) {
            yield pair.refresh();
        }
    };
}

module.exports = BBMarket;
