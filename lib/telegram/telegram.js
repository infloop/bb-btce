'use strict';

var Bot = require('node-telegram-bot');
var config = require('../config');

var chatId = null;
var bot = new Bot({
    token: config.telegram.token
})
.on('message', function (message) {
    console.log(message);
    chatId = message.chat.id;

    bot.sendMessage({
        chat_id: chatId,
        text: 'ololo'
    }, function(err, ok) {


    });
})
.start();

