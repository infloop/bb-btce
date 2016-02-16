'use strict';

/**
 * @abstract
 * @constructor
 */
class BBITradeAPI {
    /**
     * @abstract
     */
    constructor() {
        if (!new.target) throw "BBITradeAPI() must be called with new";

        if (new.target === BBITradeAPI) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }

        this.config = null;
    }

    initialize(config) {
        this.config = config;
    }

    /** @abstract */
    *depth(pair) { throw new TypeError("Abstract method should be overriden"); };

    /** @abstract */
    *fee()  { throw new TypeError("Abstract method should be overriden"); };

    /** @abstract */
    *ticker()  { throw new TypeError("Abstract method should be overriden"); };

    /** @abstract */
    *trade()  { throw new TypeError("Abstract method should be overriden"); };

    /** @abstract */
    *orderList()  { throw new TypeError("Abstract method should be overriden"); };

    /** @abstract */
    *orderInfo()  { throw new TypeError("Abstract method should be overriden"); };

    /** @abstract */
    *tradeHistory()  { throw new TypeError("Abstract method should be overriden"); };

    /** @abstract */
    *transHistory()  { throw new TypeError("Abstract method should be overriden"); };

    /** @abstract */
    *getInfo(pair)  { throw new TypeError("Abstract method should be overriden"); };

    /** @abstract */
    *cancelOrder()  { throw new TypeError("Abstract method should be overriden"); };
}

module.exports = BBITradeAPI;