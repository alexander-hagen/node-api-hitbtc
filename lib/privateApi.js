const
  axios = require('axios'),
  crypto = require('crypto');

var HitbtcPrivate = function(api) {
  this.endPoint = "https://api.hitbtc.com";
  this.apikey = api.apikey;
  this.secret = api.secret;
  this.timeout = 5000;
  this.keepalive = false;
};

var privateApi = module.exports = function(api) {
  return new HitbtcPrivate(api);
};

HitbtcPrivate.prototype.query = async function(options) {

  var query="",sep="?";

  switch(options.method) {
    case "GET": Object.keys(options.param).forEach(key => { query+=sep+key+"="+options.param[key];sep="&"; }); break;
    default: break;
  };

  const
    stamp=Date.now().toString(),
    body=JSON.stringify(options.data),
    source=options.method+
           options.url.replace(this.endPoint,"")+
           (options.param?query:"")+
           (options.data?JSON.stringify(options.data):"")+
           stamp;

//!Object.keys(options.data).length?"":JSON.stringify(options.data))+
 
  let signature = crypto.createHmac('sha256',this.secret).update(source).digest('hex');

  options["headers"]={'Authorization': 'HS256 '+Buffer.from(this.apikey+":"+signature+":"+stamp).toString('base64') };
//options["headers"]={'Authorization': 'Basic '+Buffer.from(this.apikey+":"+this.secret).toString('base64') };

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
//    data: {},
    json: true
  };
  return await this.query(options);
};

HitbtcPrivate.prototype.otherQuery = async function(method, path, query) {
  var options = {
    method: method,
    url: this.endPoint + path,
//    param: {},
    data: query,
    json: true
  };
  return await this.query(options);
};

//
// SPOT Trading
//

HitbtcPrivate.prototype.getSpotBalance = async function() {
  const path="/api/3/spot/balance";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getSpotOrders = async function(options={}) {
  var path="/api/3/spot/order",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getSpotOrder = async function(order_id) {
  const path="/api/3/spot/order/" + order_id;
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.createSpotOrder = async function(options={}) {
  var path="/api/3/spot/order";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.createSpotOrderList = async function(options={}) {
  var path="/api/3/spot/order/list";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.replaceSpotOrder = async function(order_id, options={}) {
  var path="/api/3/spot/order/" + order_id;
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("PATCH",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.cancelSpotOrders = async function() {
  const path="/api/3/spot/order";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("DELETE",path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.cancelSpotOrder = async function(order_id) {
  const path="/api/3/spot/order/" + order_id;
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("DELETE",path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getSpotFee = async function(symbol) {
  var path="/api/3/spot/fee";
  if(symbol) { path+="/"+symbol; }; 
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

//
// SPOT Trading History
//

HitbtcPrivate.prototype.getSpotOrderHistory = async function(options={}) {
  var path="/api/3/spot/history/order",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getSpotTradeHistory = async function(options={}) {
  var path="/api/3/spot/history/trade",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

//
// MARGIN Trading
// 

HitbtcPrivate.prototype.getMarginAccounts = async function() {
  const path="/api/3/margin/account";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getMarginAccount = async function(symbol) {
  const path="/api/3/margin/account/isolated/" + symbol;
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getCrossMarginAccount = async function(symbol) {
  const path="/api/3/margin/account/cross/" + symbol;
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.createUpdateMarginAccount = async function(mode, instrument, options={}) {
  const path="/api/3/margin/account/"+mode+"/"+instrument;
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("PUT",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.closeMarginPositions = async function() {
  const path="/api/3/margin/position";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("DELETE",path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.closeMarginPosition = async function(symbol,options={}) {
  const path="/api/3/margin/position/isolated/" + symbol;
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("DELETE",path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getMarginOrders = async function(options={}) {
  var path="/api/3/margin/order",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getMarginOrder = async function(order_id) {
  const path="/api/3/margin/order/" + order_id;
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.createMarginOrder = async function(options={}) {
  const path="/api/3/margin/order";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.createMarginOrderList = async function(options={}) {
  const path="/api/3/margin/order/list";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.replaceMarginOrder = async function(order_id, options={}) {
  const path="/api/3/margin/order/" + order_id;
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("PATCH",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.cancelMarginOrders = async function() {
  const path="/api/3/margin/order";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("DELETE",path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.cancelMarginOrder = async function(order_id) {
  const path="/api/3/margin/order/" + order_id;
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("DELETE",path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getMarginConfig = async function() {
  const path="/api/3/margin/config";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

//
// MARGIN Trading History
//

HitbtcPrivate.prototype.getMarginOrderHistory = async function(options={}) {
  var path="/api/3/margin/history/order",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getMarginTradeHistory = async function(options={}) {
  var path="/api/3/margin/history/trade",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getMarginPositionsHistory = async function(options={}) {
  var path="/api/3/margin/history/positions",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getMarginClearingDetails = async function(options={}) {
  var path="/api/3/margin/history/clearing",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

//
// FUTURES Trading
//

HitbtcPrivate.prototype.getFuturesBalance = async function() {
  const path="/api/3/futures/balance";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getFuturesAccounts = async function() {
  const path="/api/3/futures/account";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getFuturesAccount = async function(symbol) {
  const path="/api/3/futures/account/isolated/" + symbol;
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getFuturesCrossAccount = async function(symbol) {
  const path="/api/3/futures/account/cross/" + symbol;
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.createUpdateFuturesAccount = async function(mode,symbol,options={}) {
  const path="/api/3/futures/account/"+mode+"/"+symbol;
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("PUT",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.closeFuturesPositions = async function() {
  const path="/api/3/futures/position";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("DELETE",path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.closeFuturesPosition = async function(symbol,options={}) {
  const path="/api/3/futures/position/isolated/" + symbol;
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("DELETE",path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getFuturesOrders = async function(options={}) {
  var path="/api/3/futures/order",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getFuturesOrder = async function(order_id) {
  const path="/api/3/futures/order/" + order_id;
  const result=await this.getQuery(path,{});
  if(result.error) { throw result; };
  return result;
};

HitbtcPrivate.prototype.createFuturesOrder = async function(options={}) {
  const path="/api/3/futures/order";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.createFuturesOrderList = async function(options={}) {
  const path="/api/3/futures/order/list";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.replaceFuturesOrder = async function(order_id, options={}) {
  const path="/api/3/futures/order/" + order_id;
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("PATCH",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.cancelFuturesOrders = async function() {
  const path="/api/3/futures/order";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("DELETE",path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.cancelFuturesOrder = async function(order_id) {
  const path="/api/3/futures/order/" + order_id;
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("DELETE",path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getFuturesConfig = async function() {
  const path="/api/3/futures/config";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getFuturesFee = async function(symbol) {
  var path="/api/3/futures/fee";
  if(symbol) { path+="/"+symbol; };
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

//
// FUTURES Trading History
//

HitbtcPrivate.prototype.getFuturesOrderHistory = async function(options={}) {
  var path="/api/3/futures/history/order",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getFuturesTradeHistory = async function(options={}) {
  var path="/api/3/futures/history/trade",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getFuturesPositionsHistory = async function(options={}) {
  var path="/api/3/futures/history/positions",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getFuturesClearingDetails = async function(options={}) {
  var path="/api/3/futures/history/clearing",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

//
// WALLET Management
//

HitbtcPrivate.prototype.getWalletBalance = async function() {
  const path="/api/3/wallet/balance";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getDepositAddress = async function(options={}) {
  var path="/api/3/wallet/crypto/address",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.createDepositAddress = async function(options={}) {
  const path="/api/3/wallet/crypto/address";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getRecentDepositAddresses = async function(options) {
  var path="/api/3/wallet/crypto/address/recent-deposit",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getRecentWithdrawAddresses = async function(options) {
  var path="/api/3/wallet/crypto/address/recent-withdraw",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.withdrawCrypto = async function(options={}) {
  const path="/api/3/wallet/crypto/withdraw";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.convertCrypto = async function(options={}) {
  const path="/api/3/wallet/crypto/withdraw";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.withdrawCommit = async function(id) {
  const path="/api/3/wallet/crypto/withdraw/" + id;
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.withdrawRollback = async function(id) {
  const path="/api/3/wallet/crypto/withdraw/" + id;
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("DELETE",path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.checkMine = async function(addr) {
  const path="/api/3/wallet/crypto/address/check-mine/" + addr;
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.transferExchange = async function(options={}) {
  const path="/api/3/wallet/transfer";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.transferInternal = async function(options={}) {
  const path="/api/3/wallet/internal/withdraw";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getTransactions = async function(options={}) {
  var path="/api/3/wallet/transactions",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getTransaction = async function(id) {
  const path="/api/3/wallet/transactions/" + id;
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.checkOffchainAvailable = async function(options) {
  const path="/api/3/wallet/crypto/check-offchain-available";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getWithdrawFees = async function(options) {
  const path="/api/3/wallet/crypto/fees/estimate";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getWithdrawFee = async function(options) {
  var path="/api/3/wallet/crypto/fee/estimate",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getAirDrops = async function(options={}) {
  var path="/api/3/wallet/airdrops",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getAmountLocks = async function(options={}) {
  var path="/api/3/wallet/amount-locks",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

//
// SUB-ACCOUNTS Management
//

HitbtcPrivate.prototype.getSubaccounts = async function() {
  const path="/api/3/sub-account";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.freezeSubaccount = async function(options={}) {
  const path="/api/3/sub-account/freeze";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.activateSubaccount = async function(options={}) {
  const path="/api/3/sub-account/activate";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.transferFunds = async function(options={}) {
  const path="/api/3/sub-account/transfer";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getACL = async function(options={}) {
  var path="/api/3/sub-account/acl",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.changeACL = async function(options) {
  const path="/api/3/sub-account/acl";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options);
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getSubaccountBalance = async function(id) {
  const path="/api/3/sub-account/balance/" + id;
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};

HitbtcPrivate.prototype.getSubaccountAddress = async function(id, currency) {
  var path="/api/3/sub-account/crypto/address/" + id + "/" + currency;
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("error")) { reject(output); }
    else { resolve(output); };
  });
};
