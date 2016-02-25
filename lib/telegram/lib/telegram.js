'use strict';

var Bot = require('node-telegram-bot');
var config = require('../../config');
var Promise = require("bluebird");

class TelegramService {
    constructor() {
        this._bot = null;
    }

    * initialize(config) {
        this.config = config;

        var self = this;

        this._bot = Promise.promisifyAll(Bot({
            token: this.config.telegram.token
        }));

        this.bot.on('message', function(message) {
            self.onMessage(message);
        });

        this.bot.start();
    }

    get bot() {
        return this._bot;
    }

    * sendMessage(message) {
        yield this.bot.sendMessageAsync(message);
    }

    onMessage(message) {
        console.log(message);
        var chatId = message.chat.id;

        this.bot.sendMessage({
            chat_id: chatId,
            text: 'ololo'
        }, function(err, ok) {


        });
    }
}

module.exports = TelegramService;

