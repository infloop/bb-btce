var co = require('co');
var BTCE = require('btc-e');

/**
 * @type {BTCE}
 */
var btceTrade = Promise.promisifyAll(new BTCE("3DG426VG-43FO0QW8-OIEIQ5E9-8IRBU5T5-YSG5D5BU", "b8d9077212a3d218d09165ef993e82e97906db5cb684298e2510d71ee78272bb"));

var LTCRURPair = new Pair('',Currencies.LTC, Currencies.RUR, btceTrade);
var LTCBTCPair = new Pair('',Currencies.LTC, Currencies.BTC, btceTrade);
var BTCRURPair = new Pair('',Currencies.BTC, Currencies.RUR, btceTrade);
var USDRURPair = new Pair('',Currencies.USD, Currencies.RUR, btceTrade);
var NMCUSDPair = new Pair('',Currencies.NMC, Currencies.USD, btceTrade);
var LTCUSDPair = new Pair('',Currencies.LTC, Currencies.USD, btceTrade);
var NMCBTCPair = new Pair('',Currencies.NMC, Currencies.BTC, btceTrade);