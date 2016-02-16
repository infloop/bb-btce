'use strict';

/**
 * @abstract
 */
class BBIStorage {
    /**
     * @abstract
     */
    constructor() {
        if (!new.target) throw "BBIStorage() must be called with new";

        if (new.target === BBIStorage) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }

    /**
     * @abstract
     * @param {Object} data
     */
    * save(data) {
        throw new TypeError("Abstract method 'save' should be overriden");
    }

    /**
     * @abstract
     * @returns {Object}
     */
    * load() {
        throw new TypeError("Abstract method 'load' should be overriden");
    }

    * close(){
        throw new TypeError("Abstract method 'load' should be overriden");
    }
}

module.exports = BBIStorage;
