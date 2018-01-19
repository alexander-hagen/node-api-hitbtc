var hitbtc = require("../");

var api = hitbtc.publicApi();
api.getOrderBook("ETHBTC").then(console.log);
api.getTicker("ETHBTC").then(console.log);
api.getTrades("ETHBTC", "DESC").then(console.log);
api.getTrades("ETHBTC").then(console.log);
api.getCandlestick("ETHBTC", "M30").then(console.log);
