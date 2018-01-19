var hitbtc = require("../");

var api = hitbtc.publicApi();
api.getOrderBook("ETHBTC").then(console.log);
api.getTicker("ETHBTC").then(console.log);
api.getTrades("ETHBTC", "DESC").then(console.log);
api.getTrades("ETHBTC").then(console.log);
api.getCandlestick("ETHBTC", "M30").then(console.log);


var api2 = hitbtc.privateApi("api key", "api secret");
api2.getActiveOrders("BCHBTC").then(console.log);
api2.getAsset().then(console.log);
api2.getOrder("83a9e612d87c46a09ccc5e36718064d4").then(console.log);
api2.order("BCHBTC", 1, 0.1, "sell").then(console.log);
api2.cancelOrders("BCHBTC").then(console.log);
api2.cancelOrder("36e092063748455887b4fb894183a062").then(console.log);

