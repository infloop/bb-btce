'use strict';

/**
 *
 */
class BBPipelinePoint {
    /**
     *
     * @param {Object} data
     * @param {Number} timestamp
     */
    constructor(data, timestamp) {
        //if (!new.target) throw "BBPipelinePoint() must be called with new";

        this._data = data;
        this._timestamp = timestamp;
        this._stats = {};
    }

    /**
     * @returns {Number}
     */
    get timestamp() {
        return this._timestamp;
    }

    get stat() {
        return this._stats;
    }

    get data() {
        return this._data;
    }

    toObject() {
        return {
            _data: this._data,
            _stats: this._stats,
            _timestamp: this._timestamp
        }
    }
}

module.exports = BBPipelinePoint;