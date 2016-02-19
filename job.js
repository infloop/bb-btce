'use strict';

var BBScheduler = require('./lib/scheduler/BBScheduler');
var BBMarket = require('./lib/trade/BBMarket');
var BBStorageSink = require('./lib/pipeline/BBStorageSink');
var BBMongoStorage = require('./lib/storage/BBMongoStorage');
var config = require('./lib/config');
var co = require('co');

var scheduler = new BBScheduler();
var marketBTCE = new BBMarket('BTC-E');
var storage = new BBMongoStorage();


marketBTCE
    .getStream()
    .pipe(new BBStorageSink(storage));

co(function*() {
    yield storage.initialize(config);
    yield marketBTCE.initialize(config);
    yield scheduler.initialize(config);

    scheduler.addJob('BTCE fetch', 'every 10 minutes', {}, function(job, cb) {
        co(function*() {
            yield marketBTCE.refresh();
        }).then((val) => {
            cb();
        }, (err) => {
            console.log(err);
            cb();
        });
    });

    yield scheduler.start();
}).then((val) => {
    console.log(val);
}, (err) => {
    console.log(err);
});