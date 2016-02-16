'use strict';
let BBIStorage = require('./BBIStorage');
var MongoClient = require('mongodb').MongoClient;
var _ = require('lodash');
var co = require('co');

var config = {
    storage: {
        url: 'mongodb://localhost:27017/bb-db'
    }
};

const collectionName = 'dataflow';

class BBMongoStorage extends BBIStorage {

    constructor(config) {
        super();
        this.url = config.storage.url;
        this.connected = false;
        this.connection = null;
        this.collection = null;
    }

    isConnected() {
        return (this.connection !== null);
    }

    * connect() {
        if(this.isConnected()) {
            return this.connection;
        }
        this.connection = yield MongoClient.connect(this.url);
        this.collection = this.connection.collection(collectionName);
        return this.connection;
    }

    * save(data) {
        yield this.connect();
        yield this.collection.insertOne(data);
    }

    * load() {
        yield this.connect();
        return super.load(cb);
    }

    close(){
        if(this.isConnected()) {
            this.connection.close();
        }
    }
}

module.exports = BBMongoStorage;

var bbStorage = new BBMongoStorage(config);

co(function*() {
    yield bbStorage.save({test: 1, timestamp: (Date.now())});
}).then(function (val) {
    console.log(val);
}, function (err) {
    console.log(err);
});