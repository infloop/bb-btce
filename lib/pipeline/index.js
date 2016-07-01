'use strict';

var _ = require('lodash');
var stream = require('stream');
var redis = require('./lib/redis-like/redis');

module.exports = {
    BBDataTicker: require('./lib/tickers/BBDataTickerStream'),
    BBDataFilter: require('./lib/filters/BBStreamFilter'),
    BBMap: require('./lib/filters/BBStreamFilter'),
    BBClone: require('./lib/filters/BBClone'),
    BBSumReducer: require('./lib/reducers/BBSumReducer'),
    BBCountReducer: require('./lib/reducers/BBCountReducer'),
    BBCountUniqueReducer: require('./lib/reducers/BBCountUniqueReducer'),
    BBDailyFilter: require('./lib/filters/BBDailyFilter'),
    BBEventNameFilter: require('./lib/filters/BBEventNameFilter'),
    BBDataToJSONFormatter: require('./lib/formatters/BBDataToJSONFormatter'),
    BBDataTimeLimitFilter: require('./lib/filters/BBStreamTimeLimitFilter'),
    BBStorageSink: require('./lib/sinks/BBStorageSink'),
};


if (require.main === module) {

    var BBPipelinePoint = require('./lib/BBPipelinePoint');
    var ticker = new module.exports.BBDataTicker();
    var i = 0;
    
    var events = [
        {sqId: 1, event_name: 'games.voted', user_id: 1, game_id: 1, votes: 1,       day: 1, month: 1, year: 2016},

        {sqId: 2, event_name: 'user.followedUser', user_id: 1, followed_user_id: 2,  day: 1, month: 1, year: 2016},

        {sqId: 3, event_name: 'games.voted', user_id: 1, game_id: 2, votes: 3,       day: 1, month: 1, year: 2016},

        {sqId: 4, event_name: 'user.followedUser', user_id: 1, followed_user_id: 3,  day: 2, month: 1, year: 2016},

        {sqId: 5, event_name: 'games.voted', user_id: 1, game_id: 3, votes: 1,       day: 2, month: 1, year: 2016},
        {sqId: 6, event_name: 'games.voted', user_id: 1, game_id: 4, votes: 3,       day: 3, month: 1, year: 2016},  // <= there should be an event for daily>2 for user 1
        {sqId: 7, event_name: 'games.voted', user_id: 1, game_id: 5, votes: 1,       day: 4, month: 1, year: 2016},  // <= there should be an event for daily>3 for user 1
        {sqId: 8, event_name: 'games.voted', user_id: 1, game_id: 6, votes: 1,       day: 5, month: 1, year: 2016},
        {sqId: 9, event_name: 'games.voted', user_id: 2, game_id: 7, votes: 1,       day: 6, month: 1, year: 2016},
        {sqId: 10, event_name: 'games.voted', user_id: 2, game_id: 8, votes: 3,       day: 7, month: 1, year: 2016},
        {sqId: 11, event_name: 'games.voted', user_id: 2, game_id: 8, votes: 1,       day: 9, month: 1, year: 2016},
        {sqId: 12, event_name: 'games.voted', user_id: 2, game_id: 9, votes: 1,       day: 10, month: 1, year: 2016},
        {sqId: 13, event_name: 'games.voted', user_id: 2, game_id: 10, votes: 1,       day: 11, month: 1, year: 2016},   // <= there should be an event for daily>2 for user 2
        {sqId: 14, event_name: 'user.followedUser', user_id: 1, followed_user_id: 5,  day: 12, month: 1, year: 2016},

        {sqId: 15, event_name: 'games.voted', user_id: 3, game_id: 10, votes: 1,       day: 12, month: 1, year: 2016},
        {sqId: 16, event_name: 'games.voted', user_id: 3, game_id: 11, votes: 1,       day: 12, month: 1, year: 2016},
        {sqId: 17, event_name: 'games.voted', user_id: 3, game_id: 12, votes: 1,       day: 12, month: 1, year: 2016},
        {sqId: 18, event_name: 'games.voted', user_id: 3, game_id: 13, votes: 1,       day: 12, month: 1, year: 2016},
    ];

    setInterval(function () {
        let obj = events[i];

        if (i < events.length) {
            ticker.tick(new BBPipelinePoint(obj, Date.now()));
        }
        i++;
    }, 100);

    // FLOW 1
    ticker
        .pipe(new module.exports.BBClone())
        .pipe(new module.exports.BBEventNameFilter('games.voted'))
        .pipe(new module.exports.BBDailyFilter(2))
        .pipe(new module.exports.BBMap(
            function (point, encoding, cb) {
                point.data.name = 'FLOW 1';
                this.push(point);
                //console.log('\n REDIS: \n', redis, '\n');
                cb();
            }
        ))
        .pipe(new module.exports.BBDataToJSONFormatter())
        .pipe(process.stdout);

    // FLOW 2
    ticker
        .pipe(new module.exports.BBClone())
        .pipe(new module.exports.BBEventNameFilter('games.voted'))
        .pipe(new module.exports.BBDailyFilter(3))
        .pipe(new module.exports.BBMap(
            function (point, encoding, cb) {
                point.data.name = 'FLOW 2';
                this.push(point);
                //console.log('\n REDIS: \n', redis, '\n');
                cb();
            }
        ))
        .pipe(new module.exports.BBDataToJSONFormatter())
        .pipe(process.stdout);

    // FLOW 3
    ticker
        .pipe(new module.exports.BBClone())
        .pipe(new module.exports.BBEventNameFilter('games.voted'))
        .pipe(new module.exports.BBSumReducer('votes', 6, ['user_id'])) // votes > 5
        .pipe(new module.exports.BBMap(
            function (point, encoding, cb) {
                point.data.name = 'FLOW 3';
                this.push(point);
                //console.log('\n REDIS: \n', redis, '\n');
                cb();
            }
        ))
        .pipe(new module.exports.BBDataToJSONFormatter())
        .pipe(process.stdout);

    // FLOW 4
    ticker
        .pipe(new module.exports.BBClone())
        .pipe(new module.exports.BBEventNameFilter('games.voted'))
        .pipe(new module.exports.BBCountReducer('votes', 5, ['user_id'])) // votes > 5
        .pipe(new module.exports.BBMap(
            function (point, encoding, cb) {
                point.data.name = 'FLOW 4';
                this.push(point);
                console.log('\n REDIS: \n', redis, '\n');
                cb();
            }
        ))
        .pipe(new module.exports.BBDataToJSONFormatter())
        .pipe(process.stdout);

    // FLOW 5
    ticker
        .pipe(new module.exports.BBClone())
        .pipe(new module.exports.BBEventNameFilter('games.voted'))
        .pipe(new module.exports.BBCountUniqueReducer('game_id', 2, ['user_id'])) // votes for different games > 5
        .pipe(new module.exports.BBMap(
            function (point, encoding, cb) {
                point.data.name = 'FLOW 5';
                this.push(point);
                console.log('\n REDIS: \n', redis, '\n');
                cb();
            }
        ))
        .pipe(new module.exports.BBDataToJSONFormatter())
        .pipe(process.stdout);

    //ReadStream('rabbit', {});
    //Write('redis', 'HINCR ');
    //Filter('a > 1')
    //Read('redis', 'b = ${}')
    //Filter({});
    //WriteStream('juttle', {});
}
