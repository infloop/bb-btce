'use strict';

var _ = require('lodash');
var stream = require('stream');

module.exports = {
    BBDataTicker: require('./BBDataTickerStream'),
    BBDataFilter: require('./BBDataFilter'),
    BBDataToJSONFormatter: require('./BBDataToJSONFormatter'),
    BBDataTimeLimitFilter: require('./BBDataTimeLimitFilter'),
    BBStorageSink: require('./BBStorageSink'),
};


if(require.main === module) {

    var BBPipelinePoint = require('./BBPipelinePoint');
    var ticker = new module.exports.BBDataTicker();

    setInterval(function() {
        var obj = new BBPipelinePoint({
            _tag: 1,
            value: Math.random()
        }, Date.now());
        ticker.tick(obj);
    }, 100);

    var pipe1 = ticker
        .pipe(new module.exports.BBDataTimeLimitFilter(1000,1))
        .pipe(new module.exports.BBDataFilter(
            function (point, encoding, cb) {
                if (!(point instanceof BBPipelinePoint)) {
                    return cb();
                }

                if (point.data.value > 0.5) {
                    this.push(point);
                }
                cb();
            }
        ));

        pipe1
        .pipe(new module.exports.BBDataToJSONFormatter())
        .pipe(process.stdout);

        pipe1
        .pipe(new module.exports.BBDataToJSONFormatter())
        .pipe(process.stdout);
}
