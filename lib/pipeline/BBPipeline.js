'use strict';

var _ = require('lodash');
var stream = require('stream');
var BBPipelinePoint = require('./BBPipelinePoint');

class DataTicker extends stream {
    constructor() {
        super();
        this.readable = true;
    }

    /**
     *
     * @param {BBPipelinePoint } point
     */
    tick(point) {
        if(!(point instanceof BBPipelinePoint)) {
            throw new TypeError('DataTicker can emit only BBPipelinePoint type objects');
        }
        this.emit('data', point);
    }

    end() {
        this.emit('end');
    }
}

class DataStreamFilter extends stream.Transform {
    constructor(filter) {
        super();

        if(!_.isFunction(filter)) {
            filter = function(data, encoding, cb) { cb(); }
        }

        this.filter = filter.bind(this);

        this._readableState.objectMode = true;
        this._writableState.objectMode = true;
    }

    _transform(point, encoding, cb) {
        this.filter(point, encoding, cb);
    }

    _flush (cb) {
        cb();
    };
}

class DataTimeLimitFilter extends stream.Transform {
    constructor(timeInterval, maxNumber) {
        super();

        this.timeInterval = timeInterval;
        this.maxNumber = maxNumber;

        this.lastPointTime = 0;
        this.number = 0;

        this._readableState.objectMode = true;
        this._writableState.objectMode = true;
    }

    _transform(point, encoding, cb) {
        if((Date.now() - this.lastPointTime) >=  this.timeInterval) {
            this.number = 0;
            this.lastPointTime = Date.now();
        }

        if(this.number >= this.maxNumber) {
            return cb();
        }

        this.push(point);

        this.number++;
        cb();
    }

    _flush (cb) {
        cb();
    };
}

class DataToJSONFormatter extends stream.Transform {
    constructor() {
        super();

        this._readableState.objectMode = true;
        this._writableState.objectMode = true;
    }

    _transform(chunk, encoding, cb) {
        try {
            var data = JSON.stringify(chunk)+'\r\n';
            this.push(data);
        } catch(e) {

        }
        cb();
    }

    _flush (cb) {
        cb();
    };
}

class MongoDBSink extends stream.Writable {
    constructor() {
        super();

        this._writableState.objectMode = true;
    }

    _write(chunk, encoding, cb) {
        try {
            var data = JSON.stringify(chunk)+'\r\n';
            this.push(data);
        } catch(e) {

        }
        cb();
    }

    _flush (cb) {
        cb();
    };
}

module.exports = {
    DataTicker: DataTicker,
    DataFilter: DataStreamFilter,
    DataToJSONFormatter: DataToJSONFormatter,
    DataTimeLimitFilter: DataTimeLimitFilter,
    MongoDBSink: MongoDBSink
};


if(require.main === module) {

    var ticker = new DataTicker();

    setInterval(function() {
        var obj = new BBPipelinePoint({
            _tag: 1,
            value: Math.random()
        }, Date.now());
        ticker.tick(obj);
    }, 100);

    ticker
        .pipe(new DataTimeLimitFilter(1000,1))
        .pipe(new DataStreamFilter(
            function (point, encoding, cb) {
                if (!(point instanceof BBPipelinePoint)) {
                    return cb();
                }

                if (point.data.value > 0.5) {
                    this.push(point);
                }
                cb();
            }
        ))
        .pipe(new DataToJSONFormatter())
        .pipe(process.stdout);
}
