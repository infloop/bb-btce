'use strict';

var Agenda = require('agenda');
var Promise = require("bluebird");

class BBScheduler {

    /**
     * @abstract
     */
    constructor() {
        if (!new.target) throw new Error("BBScheduler() must be called with new");

        this.config = null;

        /** @type {Agenda} */
        if(!(BBScheduler.runner instanceof Agenda)) {
            BBScheduler.runner = null;
            BBScheduler.ready = false;
        }

        process.on('SIGTERM', this.graceful);
        process.on('SIGINT' , this.graceful);
    }

    graceful() {
        if(BBScheduler.runner instanceof Agenda) {
            console.log('Stopping job manager...');
            BBScheduler.runner.stop(function() {
                BBScheduler.ready = false;
                console.log('Stopped job manager');
                process.exit(0);
            });
        }
    }

    * initialize(config) {
        this.config = config;

        /** @type {Agenda} */
        if(!(BBScheduler.runner instanceof Agenda)) {
            BBScheduler.ready = false;
            BBScheduler.runner = new Agenda({
                db: {
                    address: this.config.agenda.url,
                    collection: this.config.agenda.collection
                }
            });
        }
    }

    doConnect(cb) {
        if (BBScheduler.ready === false) {
            BBScheduler.runner.on('ready', function () {
                BBScheduler.ready = true;
                BBScheduler.runner.start();
                console.log('Started job manager');
                cb();
            });
        }
    }

    *start() {
        if (BBScheduler.ready === false) {
            console.log('Starting job manager...');
            yield this.doConnect;
        }
    }

    stop() {
        if (BBScheduler.ready === true) {
            BBScheduler.ready = false;
            BBScheduler.runner.stop();
        }
    }

    addJob(name, every, options, func) {
        if (BBScheduler.ready === true) {
            options = options || {};
            options.priority = 'normal';
            BBScheduler.runner.define(name, options, func);
            BBScheduler.runner.every(every, name);
        }
    }
}

module.exports = BBScheduler;