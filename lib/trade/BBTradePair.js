'use strict';

var Storage = require('./../storage');
var _ = require('lodash');
var co = require('co');
var Currencies = require('./BBCurrencies');
var Transaction = require('./transaction');
var events  = require('events');
var util = require('util');


function onerror(err) {
    // log any uncaught errors
    // co will not throw any errors you do not handle!!!
    // HANDLE ALL YOUR ERRORS!!!
    console.error(err.stack);
}

class BBTradePair {

    /**
     *
     * @param name
     * @param sourceCurrency
     * @param destCurrency
     * @param tradeOperator
     */
    constructor(name, sourceCurrency, destCurrency, tradeOperator) {
        this.name = name;

        /** @type {BBITradeAPI|null} */
        this.tradeOperator = tradeOperator || null;

        this.sourceCurrency = sourceCurrency;
        this.destCurrency = destCurrency;

        this.tradePairName = sourceCurrency.toLocaleLowerCase()+'_'+destCurrency.toLocaleLowerCase();

        if((this.sourceCurrency == Currencies.BTC && this.destCurrency == Currencies.RUR) ||
            (this.sourceCurrency == Currencies.RUR && this.destCurrency == Currencies.BTC))
        {
            this.tradePairName = 'btc_rur';
            this.sourceCurrency = sourceCurrency;
            this.sourceCurrency = sourceCurrency;
        }

        /**
         *
         * @type {BBIStorage}
         */
        this.storage = null;
    }

    initialize(config) {
        this.storage = new BBMongoStorage(config);
    };

    /**
     * @param {BBITradeAPI} tradeOperator
     */
    setTradeOperator(tradeOperator) {
        this.tradeOperator = tradeOperator;
    };

    *save() {
        yield this.storage.save(this.fee);
        yield this.storage.saveAsync('bids', this.bids);
        yield this.storage.saveAsync('asks', this.asks);
        yield this.storage.saveAsync('status', this.status);
        yield this.storage.saveAsync('lastUpdate', this.lastUpdate);
    };
}


module.exports = Pair;