'use strict';

let BBCurrencies = require('../trade/BBCurrencies');

module.exports = {
    'ltc_rur': {source: BBCurrencies.LTC, destination: BBCurrencies.RUR},
    'ltc_btc': {source: BBCurrencies.LTC, destination: BBCurrencies.BTC},
    'btc_rur': {source: BBCurrencies.BTC, destination: BBCurrencies.RUR},
    'usd_rur': {source: BBCurrencies.USD, destination: BBCurrencies.RUR},
    'nmc_usd': {source: BBCurrencies.NMC, destination: BBCurrencies.USD},
    'ltc_usd': {source: BBCurrencies.LTC, destination: BBCurrencies.USD},
    'nmc_btc': {source: BBCurrencies.NMC, destination: BBCurrencies.BTC}
};