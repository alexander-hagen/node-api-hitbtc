const
  axios = require('axios'),
  { RateLimiter } = require('limiter');

const
  bucket={
    default: new TokenBucket({ bucketSize: 50, tokensPerInterval: 20, interval: "second" }),
    public: new TokenBucket({ bucketSize: 80, tokensPerInterval: 30, interval: "second" }),
    wallet: new TokenBucket({ bucketSize: 20, tokensPerInterval: 10, interval: "second" }),
    spot: new TokenBucket({ bucketSize: 750, tokensPerInterval: 300, interval: "second" }),
    margin: new TokenBucket({ bucketSize: 750, tokensPerInterval: 300, interval: "second" }),
    futures: new TokenBucket({ bucketSize: 750, tokensPerInterval: 300, interval: "second" }),
    transfer: new TokenBucket({ bucketSize: 20, tokensPerInterval: 10, interval: "second" }),
    wsPublic: new TokenBucket({ bucketSize: 20, tokensPerInterval: 10, interval: "second" }),
    wsTrading: new TokenBucket({ bucketSize: 20, tokensPerInterval: 10, interval: "second" }),
    wsWallet: new TokenBucket({ bucketSize: 20, tokensPerInterval: 10, interval: "second" })
  };

var HitbtcPublic = function() {
  this.endPoint = "https://api.hitbtc.com/api/3";
  this.timeout = 5000;
  this.keepalive = false;
};

var publicApi = module.exports = function() {
  return new HitbtcPublic();
};

HitbtcPublic.prototype.query = async function(options) {

  try {
    const res=await axios(options);
    return res.data;
  } catch(err) {
    var response={ data: options };
    if(!err.hasOwnProperty("response")) { Object.assign(response,{ status: "503", code: err.code }); }
    else {
      Object.assign(response,{ status: err.status });
      if(err.response.hasOwnProperty("data")) { Object.assign(response,{ code: err.response.data.error.code, error: err.response.data.error.message }); };
    };
    return response;

//    var response;
//    if(err.hasOwnProperty("response")) {
//      response={
//        code: err.response.status,
//        error: err.response.data.error.message,
//        reason: err.response.data.error.code,
//        data: options
//      };
//    } else {
//      response={
//        code: err.code,
//        error: "Unknown error occured",
//        data: options
//      };
//    };
//    return response;

  };
};

HitbtcPublic.prototype.getQuery = async function(path,query) {
  var options = {
    method: "GET",
    url: this.endPoint + path,
    params: query,
    data: {}
  };
  return await this.query(options);
};

// Market Data

// Get Currencies
// Get Currency

HitbtcPublic.prototype.getCurrency = async function(currencies) {
  var path="/public/currency";
  if (currencies !== undefined) { path+="/"+currencies; };
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["public"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

// Get Symbols
// Get Symbol

HitbtcPublic.prototype.getSymbol = async function(symbols) {
  var path="/public/symbol";
  if (symbols !== undefined) { path+="/"+symbols; };
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["public"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

// Get Tickers
// Get Ticker by Symbol

HitbtcPublic.prototype.getTicker = async function(symbols) {
  var path="/public/ticker";
  if (symbols !== undefined) { path+="/"+symbols; };
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["public"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

// Get Prices

HitbtcPublic.prototype.getPrices = async function(options) {
  var path="/public/price/rate",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["public"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

// Get Prices History

HitbtcPublic.prototype.getPricesHistory = async function(options) {
  var path="/public/price/history",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["public"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

// Get Ticker Last Prices
// Get Ticker Last Prices by Symbol

HitbtcPublic.prototype.getTickerLastPrices = async function(symbols) {
  var path="/public/price/ticker" ;
  if (symbols !== undefined) { path+="/"+symbols; };
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["public"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

// Get Trades
// Get Trades by Symbol

HitbtcPublic.prototype.getTrades = async function(symbols,options={}) {
  var path="/public/trades",sep="?";
  if (symbols !== undefined) { path+="/"+symbols; };
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["public"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

// Get Order Books
// Get Order Book by Symbol

HitbtcPublic.prototype.getOrderBook = async function(symbols,options={}) {
  var path="/public/orderbook",sep="?";
  if(symbols) { path+="/"+symbols; };
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["public"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

// Get Candles
// Get Candles by Symbol

HitbtcPublic.prototype.getCandles = async function(symbols,options={}) {
  var path="/public/candles",sep="?";
  if(symbols) { path+="/"+symbols; };
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["public"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

// Get Converted Candles
// Get Converted Candles by Symbol

HitbtcPublic.prototype.getConvertedCandles = async function(symbols,options={}) {
  var path="/public/converted/candles",sep="?";
  if(symbols) { path+="/"+symbols; };
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["public"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

// Get Futures Information
// Get Futures Information for Contract

HitbtcPublic.prototype.getFuturesInformation = async function(symbols) {
  var path="/public/futures/info";
  if (symbols !== undefined) { path+="?symbols="+symbols; };
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["public"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

// Get Funding History
// Get Funding History for Contract

HitbtcPublic.prototype.getFundingHistory = async function(options={}) {
  var path="/public/futures/history/funding",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["public"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

// Get Index Price Candles
// Get Index Price Candles by Contract

HitbtcPublic.prototype.getIndexPriceCandles = async function(options={}) {
  var path="/public/futures/candles/index_price",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["public"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

// Get Mark Price Candles
// Get Mark Price Candles by Contract

HitbtcPublic.prototype.getMarkPriceCandles = async function(options={}) {
  var path="/public/futures/candles/mark_price",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["public"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

// Get Premium Index Candles
// Get Premium Index Candles by Contract

HitbtcPublic.prototype.getPremiumIndexCandles = async function(options={}) {
  var path="/public/futures/candles/premium_index",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["public"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

// Get Open Interest Candles
// Get Open Interest Candles by Contract

HitbtcPublic.prototype.getOpenInterestCandles = async function(options={}) {
  var path="/public/futures/candles/open_interest",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const remaining=await bucket["public"].removeTokens(1);
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};
