var co = require('co');

var Agenda = require('agenda');

class BBIJob {

    /**
     * @abstract
     */
    constructor() {
        if (!new.target) throw "BBIJob() must be called with new";

        if (new.target === BBIJob) {
            throw new TypeError("Cannot construct abstract instances directly");
        }

        this.config = null;

        /** @type {Agenda} */
        if(!(BBIJob.runner instanceof Agenda)) {
            BBIJob.runner = null;
            BBIJob.ready = false;
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
        if(!(BBIJob.runner instanceof Agenda)) {
            BBIJob.runner = new Agenda({
                db: {
                    address: this.config.agenda.url,
                    collection: this.config.agenda.collection
                }
            });
            BBIJob.runner.on('ready', function() {
                BBIJob.ready = true;
            });
        } else {

        }
    }

    *start() {
        this.runner.start();
    }

    *stop() {
        if(BBIJob.ready === true) {
            BBIJob.ready = false;
            this.runner.stop();
        }
}

    add(name, options, func) {
        this.runner.define(name, options, func);
    }


}