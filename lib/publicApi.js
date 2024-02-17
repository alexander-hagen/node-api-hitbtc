const
  axios = require('axios');

var HitbtcPublic = function() {
  this.endPoint = "https://api.hitbtc.com/api/3";
  this.timeout = 5000;
  this.keepalive = false;
};

HitbtcPublic.prototype.query = async function(options) {

  try {
    const res=await axios(options);
    return res.data;
  } catch(err) {
    var response;
    if(err.hasOwnProperty("response")) {
      response={
        code: err.response.status,
        error: err.response.data.error.message,
        reason: err.response.data.error.code,
        data: options
      };
    } else {
      response={
        code: err.code,
        error: "Unknown error occured",
        data: options
      };
    };
    return response;
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
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

// Get Symbols
// Get Symbol

HitbtcPublic.prototype.getSymbol = async function(symbols) {
  var path="/public/symbol";
  if (symbols !== undefined) { path+="/"+symbols; };
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

// Get Tickers
// Get Ticker by Symbol

HitbtcPublic.prototype.getTicker = async function(symbols) {
  var path="/public/ticker";
  if (symbols !== undefined) { path+="/"+symbols; };
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

// Get Prices

HitbtcPublic.prototype.getPrices = async function(options) {
  var path="/public/price/rate",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

// Get Prices History

HitbtcPublic.prototype.getPricesHistory = async function(options) {
  var path="/public/price/history",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

// Get Ticker Last Prices
// Get Ticker Last Prices by Symbol

HitbtcPublic.prototype.getTickerLastPrices = async function(symbols) {
  var path="/public/price/ticker" ;
  if (symbols !== undefined) { path+="/"+symbols; };
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

// Get Trades
// Get Trades by Symbol

HitbtcPublic.prototype.getTrades = async function(symbols,options={}) {
  var path="/public/trades",sep="?";
  if (symbols !== undefined) { path+="/"+symbols; };
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

// Get Order Books
// Get Order Book by Symbol

HitbtcPublic.prototype.getOrderBook = async function(symbols,options={}) {
  var path="/public/orderbook",sep="?";
  if(symbols) { path+="/"+symbols; };
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

// Get Candles
// Get Candles by Symbol

HitbtcPublic.prototype.getCandles = async function(symbols,options={}) {
  var path="/public/candles",sep="?";
  if(symbols) { path+="/"+symbols; };
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

// Get Converted Candles
// Get Converted Candles by Symbol

HitbtcPublic.prototype.getConvertedCandles = async function(symbols,options={}) {
  var path="/public/converted/candles",sep="?";
  if(symbols) { path+="/"+symbols; };
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

// Get Futures Information
// Get Futures Information for Contract

HitbtcPublic.prototype.getFuturesInformation = async function(symbols) {
  var path="/public/futures/info";
  if (symbols !== undefined) { path+="?symbols="+symbols; };
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

// Get Funding History
// Get Funding History for Contract

HitbtcPublic.prototype.getFundingHistory = async function(options={}) {
  var path="/public/futures/history/funding",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

// Get Index Price Candles
// Get Index Price Candles by Contract

HitbtcPublic.prototype.getIndexPriceCandles = async function(options={}) {
  var path="/public/futures/candles/index_price",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

// Get Mark Price Candles
// Get Mark Price Candles by Contract

HitbtcPublic.prototype.getMarkPriceCandles = async function(options={}) {
  var path="/public/futures/candles/mark_price",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

// Get Premium Index Candles
// Get Premium Index Candles by Contract

HitbtcPublic.prototype.getPremiumIndexCandles = async function(options={}) {
  var path="/public/futures/candles/premium_index",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

// Get Open Interest Candles
// Get Open Interest Candles by Contract

HitbtcPublic.prototype.getOpenInterestCandles = async function(options={}) {
  var path="/public/futures/candles/open_interest",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

var publicApi = module.exports = function() {
  return new HitbtcPublic();
};
