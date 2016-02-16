'use strict';

var _ = require('lodash');

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
    }

    * initialize(config) {
        this.config = config;
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
    }

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
