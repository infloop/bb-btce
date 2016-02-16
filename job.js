var co = require('co');

var Pair = require('./lib/trade/BBTradePair');

/**
 * @type {BTCE}
 */

var LTCRURPair = new Pair('',Currencies.LTC, Currencies.RUR, btceTrade);
var LTCBTCPair = new Pair('',Currencies.LTC, Currencies.BTC, btceTrade);
var BTCRURPair = new Pair('',Currencies.BTC, Currencies.RUR, btceTrade);
var USDRURPair = new Pair('',Currencies.USD, Currencies.RUR, btceTrade);
var NMCUSDPair = new Pair('',Currencies.NMC, Currencies.USD, btceTrade);
var LTCUSDPair = new Pair('',Currencies.LTC, Currencies.USD, btceTrade);
var NMCBTCPair = new Pair('',Currencies.NMC, Currencies.BTC, btceTrade);

var Agenda = require('agenda');

class BBIJob {

    /**
     * @abstract
     */
    constructor() {
        if (!new.target) throw "BBIJob() must be called with new";

        if (new.target === BBIJob) {
            throw new TypeError("Cannot construct abstract instances directly");
        }

        this.config = null;

        /** @type {Agenda} */
        if(BBIJob.runner === undefined) {
            BBIJob.runner = null;
        }
    }

    initialize(config) {
        this.config = config;

        /** @type {Agenda} */
        if(!(BBIJob.runner instanceof Agenda)) {
            BBIJob.runner = new Agenda({
                db: {
                    address: this.config.agenda.url,
                    collection: this.config.agenda.collection
                }
            });
            BBIJob.runner.on('ready', function() {

            });
        }
    }

    *start() {
        this.runner.start();
    }

    *stop() {
        this.runner.stop();
    }

    add() {
        this.runner.define()
    }
}