var bitbank = require("../");

var api = bitbank.publicApi();
api.getOrderBook("ETHBTC").then(console.log);
