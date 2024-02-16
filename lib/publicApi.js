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
