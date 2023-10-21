const
  axios = require('axios');

var HitbtcPublic = function() {
  this.endPoint = "https://api.hitbtc.com/api/3";
  this.timeout = 5000;
  this.keepalive = false;
};

HitbtcPublic.prototype.query = async function(path) {
  const options={
    url: this.endPoint + path,
    method: "GET",
    timeout: this.timeout,
    forever: this.keepalive
  };
  return await axios(options).then(function(res) {
    return res.data;
  }).catch(function(err) {
    console.log("Error: " + err, options);
    throw new Error(err.statusCode);
  });
};

// Market Data

HitbtcPublic.prototype.getCurrency = function(currencies) {
  var path="/public/currency";
  if (currencies !== undefined) { path+="/"+currencies; };
  return this.query(path);
};

HitbtcPublic.prototype.getSymbol = function(symbols) {
  var path="/public/symbol";
  if (symbols !== undefined) { path+="/"+symbols; };
  return this.query(path);
};

HitbtcPublic.prototype.getTicker = function(symbols) {
  var path="/public/ticker";
  if (symbols !== undefined) { path+="/"+symbols; };
  return this.query(path);
};

HitbtcPublic.prototype.getPrices = function(options) {
  var path="/public/price/rate",sep="?";
  return this.query(path);
};

HitbtcPublic.prototype.getPricesHistory = function(options) {
  var path="/public/price/history",sep="?";
  Object.keys(options).forEach(key => { path+=sep+"="+options[key]; sep="&"; });
  return this.query(path);
};

HitbtcPublic.prototype.getTickerLastPrices = function(symbols) {
  var path="/public/price/ticker" ;
  if (symbols !== undefined) { path+="/"+symbols; };
  return this.query(path);
};

HitbtcPublic.prototype.getTrades = function(symbols,options) {
  var path="/public/trades",sep="?";
  if (symbols !== undefined) { path+="/"+symbols; };
  Object.keys(options).forEach(key => { path+=sep+"="+options[key]; sep="&"; });
  return this.query(path);
};

HitbtcPublic.prototype.getOrderBook = function(symbols,options) {
  var path="/public/orderbook/"+symbols,sep="?";
  Object.keys(options).forEach(key => { path+=sep+"="+options[key]; sep="&"; });
  return this.query(path);
};

HitbtcPublic.prototype.getCandles = function(symbols,options) {
  var path="/public/candles/"+symbols,sep="?";
  Object.keys(options).forEach(key => { path+=sep+"="+options[key]; sep="&"; });
  return this.query(path);
};

HitbtcPublic.prototype.getFuturesInformation = function(symbols) {
  var path="/public/futures/info";
  if (symbols !== undefined) { path+="/"+symbols; };
  return this.query(path);
};

HitbtcPublic.prototype.getFuturesHistory = function(options) {
  var path="/public/futures/history/funding",sep="?";
  Object.keys(options).forEach(key => { path+=sep+"="+options[key]; sep="&"; });
  return this.query(path);
};

HitbtcPublic.prototype.getIndexPriceCandles = function(options) {
  var path="/public/futures/candles/index_price",sep="?";
  Object.keys(options).forEach(key => { path+=sep+"="+options[key]; sep="&"; });
  return this.query(path);
};

HitbtcPublic.prototype.getmarkPriceCandles = function(options) {
  var path="/public/futures/candles/mark_price",sep="?";
  Object.keys(options).forEach(key => { path+=sep+"="+options[key]; sep="&"; });
  return this.query(path);
};

HitbtcPublic.prototype.getPremiumIndexCandles = function(options) {
  var path="/public/futures/candles/premium_index",sep="?";
  Object.keys(options).forEach(key => { path+=sep+"="+options[key]; sep="&"; });
  return this.query(path);
};

HitbtcPublic.prototype.getOpenInterestCandles = function(options) {
  var path="/public/futures/candles/open_interest",sep="?";
  Object.keys(options).forEach(key => { path+=sep+"="+options[key]; sep="&"; });
  return this.query(path);
};

var publicApi = module.exports = function() {
  return new HitbtcPublic();
};
