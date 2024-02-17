const
  axios = require('axios'),
  crypto = require('crypto');

var HitbtcPrivate = function(api) {
  this.endPoint = "https://api.hitbtc.com/api/3";
  this.apikey = api.apikey;
  this.secret = api.secret;
  this.timeout = 5000;
  this.keepalive = false;
};

var privateApi = module.exports = function(api) {
  return new HitbtcPrivate(api);
};

HitbtcPrivate.prototype.query = async function(options) {
  options["headers"]={'Authorization': 'Basic '+Buffer.from(this.apikey+":"+this.secret).toString('base64') };

  try {
    const res=await axios(options);
    return res.data;
  } catch(err) {
    var response;
    if(err.response.data.error) {
      response={
        code: err.response.status,
        error: err.response.data.error.message,
        reason: err.response.data.error.code,
        data: options
      };
    } else {
      response={
        code: err.code,
        error: (err.response.data?err.response.data:"Unknown error occured"),
        data: options
      };
    };
    return response;
  };

};

HitbtcPrivate.prototype.getQuery = async function(path, query) {
  var options = {
    method: "GET",
    url: this.endPoint + path,
    param: query,
    data: {},
    json: true
  };
  return await this.query(options);
};

HitbtcPrivate.prototype.otherQuery = async function(method, path, query) {
  var options = {
    method: method,
    url: this.endPoint + path,
    param: {},
    data: query,
    json: true
  };
  return await this.query(options);
};

//
// SPOT Trading
//

HitbtcPrivate.prototype.getSpotBalance = async function() {
  const path="/spot/balance";
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getSpotOrders = async function(options={}) {
  var path="/spot/order",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getSpotOrder = async function(order_id) {
  const path="/spot/order/" + order_id;
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.createSpotOrder = async function(options={}) {
  var path="/spot/order";
  const result=await this.otherQuery("POST",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.createSpotOrderList = async function(options={}) {
  var path="/spot/order/list";
  const result=await this.otherQuery("POST",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.replaceSpotOrder = async function(order_id, options={}) {
  var path="/spot/order/" + order_id;
  const result=await this.otherQuery("PATCH",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.cancelSpotOrders = async function() {
  const path="/spot/order";
  const result=await this.otherQuery("DELETE",path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.cancelSpotOrder = async function(order_id) {
  const path="/spot/order/" + order_id;
  const result=await this.otherQuery("DELETE",path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getSpotFee = async function(symbol) {
  var path="/spot/fee";
  if(symbol) { path+="/"+symbol; }; 
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

//
// SPOT Trading History
//

HitbtcPrivate.prototype.getSpotOrderHistory = async function(options={}) {
  var path="/spot/history/order",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getSpotTradeHistory = async function(options={}) {
  var path="/spot/history/trade",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

//
// MARGIN Trading
// 

HitbtcPrivate.prototype.getMarginAccounts = async function() {
  const path="/margin/account";
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getMarginAccount = async function(symbol) {
  const path="/margin/account/isolated/" + symbol;
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getCrossMarginAccount = async function(symbol) {
  const path="/margin/account/cross/" + symbol;
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.createUpdateMarginAccount = async function(mode, instrument, options={}) {
  const path="/margin/account/"+mode+"/"+instrument;
  const result=await this.otherQuery("PUT",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;

};

HitbtcPrivate.prototype.closeMarginPositions = async function() {
  const path="/margin/position";
  const result=await this.otherQuery("DELETE",path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.closeMarginPosition = async function(symbol,options={}) {
  const path="/margin/position/isolated/" + symbol;
  const result=await this.otherQuery("DELETE",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getMarginOrders = async function(options={}) {
  var path="/margin/order",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getMarginOrder = async function(order_id) {
  const path="/margin/order/" + order_id;
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.createMarginOrder = async function(options={}) {
  const path="/margin/order";
  const result=await this.otherQuery("POST",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.createMarginOrderList = async function(options={}) {
  const path="/margin/order/list";
  const result=await this.otherQuery("POST",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.replaceMarginOrder = async function(order_id, options={}) {
  const path="/margin/order/" + order_id;
  const result=await this.otherQuery("PATCH",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.cancelMarginOrders = async function() {
  const path="/margin/order";
  const result=await this.otherQuery("DELETE",path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.cancelMarginOrder = async function(order_id) {
  const path="/margin/order/" + order_id;
  const result=await this.otherQuery("DELETE",path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getMarginConfig = async function() {
  const path="/margin/config";
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

//
// MARGIN Trading History
//

HitbtcPrivate.prototype.getMarginOrderHistory = async function(options={}) {
  var path="/margin/history/order",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getMarginTradeHistory = async function(options={}) {
  var path="/margin/history/trade",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getMarginPositionsHistory = async function(options={}) {
  var path="/margin/history/positions",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getMarginClearingDetails = async function(options={}) {
  var path="/margin/history/clearing",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

//
// FUTURES Trading
//

HitbtcPrivate.prototype.getFuturesBalance = async function() {
  const path="/futures/balance";
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getFuturesAccounts = async function() {
  const path="/futures/account";
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getFuturesAccount = async function(symbol) {
  const path="/futures/account/isolated/" + symbol;
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getFuturesCrossAccount = async function(symbol) {
  const path="/futures/account/cross/" + symbol;
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.createUpdateFuturesAccount = async function(mode,symbol,options={}) {
  const path="/futures/account/"+mode+"/"+symbol;
  const result=await this.otherQuery("PUT",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.closeFuturesPositions = async function() {
  const path="/futures/position";
  const result=await this.otherQuery("DELETE",path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.closeFuturesPosition = async function(symbol,options={}) {
  const path="/futures/position/isolated/" + symbol;
  const result=await this.otherQuery("DELETE",path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getFuturesOrders = async function(options={}) {
  var path="/futures/order",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getFuturesOrder = async function(order_id) {
  const path="/futures/order/" + order_id;
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.createFuturesOrder = async function(options={}) {
  const path="/futures/order";
  const result=await this.otherQuery("POST",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.createFuturesOrderList = async function(options={}) {
  const path="/futures/order/list";
  const result=await this.otherQuery("POST",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.replaceFuturesOrder = async function(order_id, options={}) {
  const path="/futures/order/" + order_id;
  const result=await this.otherQuery("PATCH",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.cancelFuturesOrders = async function() {
  const path="/futures/order";
  const result=await this.otherQuery("DELETE",path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.cancelFuturesOrder = async function(order_id) {
  const path="/futures/order/" + order_id;
  const result=await this.otherQuery("DELETE",path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getFuturesConfig = async function() {
  const path="/futures/config";
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getFuturesFee = async function(symbol) {
  var path="/futures/fee";
  if(symbol) { path+="/"+symbol; };
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

//
// FUTURES Trading History
//

HitbtcPrivate.prototype.getFuturesOrderHistory = async function(options={}) {
  var path="/futures/history/order",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getFuturesTradeHistory = async function(options={}) {
  var path="/futures/history/trade",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getFuturesPositionsHistory = async function(options={}) {
  var path="/futures/history/positions",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getFuturesClearingDetails = async function(options={}) {
  var path="/futures/history/clearing",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

//
// WALLET Management
//

HitbtcPrivate.prototype.getWalletBalance = async function() {
  const path="/wallet/balance";
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getDepositAddress = async function(options={}) {
  var path="/wallet/crypto/address",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.createDepositAddress = async function(options={}) {
  const path="/wallet/crypto/address";
  const result=await this.otherQuery("POST",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getRecentDepositAddresses = async function(options) {
  var path="/wallet/crypto/address/recent-deposit",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getRecentWithdrawAddresses = async function(options) {
  var path="/wallet/crypto/address/recent-withdraw",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.withdrawCrypto = async function(options={}) {
  const path="/wallet/crypto/withdraw";
  const result=await this.otherQuery("POST",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.convertCrypto = async function(options={}) {
  const path="/wallet/crypto/withdraw";
  const result=await this.otherQuery("POST",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.withdrawCommit = async function(id) {
  const path="/wallet/crypto/withdraw/" + id;
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.withdrawRollback = async function(id) {
  const path="/wallet/crypto/withdraw/" + id;
  const result=await this.otherQuery("DELETE",path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.checkMine = async function(addr) {
  const path="/wallet/crypto/address/check-mine/" + addr;
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.transferExchange = async function(options={}) {
  const path="/wallet/transfer";
  const result=await this.otherQuery("POST",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.transferInternal = async function(options={}) {
  const path="/wallet/internal/withdraw";
  const result=await this.otherQuery("POST",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getTransactions = async function(options={}) {
  var path="/wallet/transactions",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getTransaction = async function(id) {
  const path="/wallet/transactions/" + id;
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.checkOffchainAvailable = async function(options) {
  const path="/wallet/crypto/check-offchain-available";
  const result=await this.otherQuery("POST",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getWithdrawFees = async function(options) {
  const path="/wallet/crypto/fees/estimate";
  const result=await this.otherQuery("POST",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getWithdrawFee = async function(options) {
  var path="/wallet/crypto/fee/estimate",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getAirDrops = async function(options={}) {
  var path="/wallet/airdrops",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getAmountLocks = async function(options={}) {
  var path="/wallet/amount-locks",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

//
// SUB-ACCOUNTS Management
//

HitbtcPrivate.prototype.getSubaccounts = async function() {
  const path="/sub-account";
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.freezeSubaccount = async function(options={}) {
  const path="/sub-account/freeze";
  const result=await this.otherQuery("POST",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.activateSubaccount = async function(options={}) {
  const path="/sub-account/activate";
  const result=await this.otherQuery("POST",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.transferFunds = async function(options={}) {
  const path="/sub-account/transfer";
  const result=await this.otherQuery("POST",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getACL = async function(options={}) {
  var path="/sub-account/acl",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.changeACL = async function(options) {
  const path="/sub-account/acl";
  const result=await this.otherQuery("POST",path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getSubaccountBalance = async function(id) {
  const path="/sub-account/balance/" + id;
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

HitbtcPrivate.prototype.getSubaccountAddress = async function(id, currency) {
  var path="/sub-account/crypto/address/" + id + "/" + currency;
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};
