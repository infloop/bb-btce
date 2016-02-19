'use strict';

var Agenda = require('agenda');

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
        this.stop();
    }

    * initialize(config) {
        this.config = config;

        /** @type {Agenda} */
        if(!(BBScheduler.runner instanceof Agenda)) {
            BBScheduler.runner = new Agenda({
                db: {
                    address: this.config.agenda.url,
                    collection: this.config.agenda.collection
                }
            });
        }
    }

    *start() {
        if (BBScheduler.ready === false) {
            this.runner.start();
        }
    }

    stop() {
        if (BBScheduler.ready === true) {
            BBScheduler.ready = false;
            this.runner.stop();
        }
    }

    addJob(name, every, options, func) {
        this.runner.define(name, options, func);
        this.runner.every(every, name);
    }
}

module.exports = BBScheduler;