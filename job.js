'use strict';

var BBScheduler = require('./lib/scheduler/BBScheduler');
var BBMarket = require('./lib/trade/BBMarket');
var BBStorageSink = require('./lib/pipeline/lib/sinks/BBStorageSink');
var BBMongoStorage = require('./lib/storage/BBMongoStorage');
var BBDataToJSONFormatter = require('./lib/pipeline/lib/formatters/BBDataToJSONFormatter');
var TelegramService = require('./lib/telegram/lib/telegram');
var config = require('./lib/config');
var co = require('co');

var scheduler = new BBScheduler();
var marketBTCE = new BBMarket('BTC-E');
var storage = new BBMongoStorage();
var telegramService = new TelegramService();


marketBTCE
    .getStream()
    .pipe(new BBStorageSink(storage));

marketBTCE
    .getStream()
    .pipe(new BBDataToJSONFormatter())
    .pipe(process.stdout);

co(function*() {
    yield storage.initialize(config);
    yield marketBTCE.initialize(config);
    yield scheduler.initialize(config);
    yield telegramService.initialize(config);
    yield scheduler.start();
    scheduler.addJob('BTCE fetch', '10 seconds', {}, function(job, cb) {
        co(function*() {
            yield marketBTCE.refresh();
            //yield (function(cb) {cb()});
        }).then((val) => {
            cb();
        }, (err) => {
            console.log('ERR:' + err);
            cb();
        });
    });

    yield scheduler.start();
}).then((val) => {
    console.log(val);
}, (err) => {
    console.log(err);
});