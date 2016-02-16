'use strict';

let BBIStorage = require('./BBIStorage');
var MongoClient = require('mongodb').MongoClient;
var _ = require('lodash');
var co = require('co');
var config = require('../config');
var done = function(cb) {
    cb();
};

class BBMongoStorage extends BBIStorage {

    constructor() {
        super();

        this.connected = false;
        this.connection = null;
        this.collection = null;
    }

    * initialize(config) {
        this.config = config;
    }

    /**
     * @returns {boolean}
     */
    isConnected() {
        return (this.connection !== null);
    }

    /**
     *
     * @returns {Db}
     */
    * connect() {
        if(this.isConnected()) {
            return this.connection;
        }
        this.connection = yield MongoClient.connect(this.config.storage.url);
        this.collection = this.connection.collection(this.config.storage.collection);
        return this.connection;
    }

    /**
     *
     * @param {Object} data
     */
    * save(data) {
        yield this.connect();
        yield this.collection.insertOne(data);
    }

    /**
     *
     * @param {Number} offset
     * @param {Number} limit
     * @param {Object|null} query
     * @returns {Cursor}
     */
    * load(offset, limit, query) {
        limit = (limit|0) || 0;
        query = query || {};
        yield this.connect();
        return this.collection.find(query).limit(limit|0).skip(offset|0).sort(['timestamp', 1]).batchSize(5);
    }

    * close(){
        if(this.isConnected()) {
            this.connection.close();
        }
    }
}

module.exports = BBMongoStorage;

if(require.main === module) {
    var bbStorage = new BBMongoStorage();

    co(function*() {
        yield bbStorage.initialize(config);
        yield bbStorage.save({test: 1, timestamp: (Date.now())});
        return bbStorage.load()
    }).then(function (val) {
        console.log(val);
    }, function (err) {
        console.log(err);
    });
}