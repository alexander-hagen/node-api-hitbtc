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

  return await axios(options)
    .then(function(res) { return res.data })
    .catch(function(err) {
      var response;
      if(err.hasOwnProperty("response")) {
        response={
          status: err.response.status,
          error: err.response.data.error.message,
          reason: err.response.data.error.code,
          data: options
        };
      } else {
        response={
          status: err.code,
//          error: err.response.data.message,
//          reason: err.response.data.code,
          data: options
        };
      };

      return Promise.reject(response);
    });
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

HitbtcPrivate.prototype.getSpotBalance = function() {
  const path="/spot/balance";
  return this.getQuery(path, {});
};

HitbtcPrivate.prototype.getSpotOrders = function(options={}) {
  const path="/spot/order";
  return this.getQuery(path, options);
};

HitbtcPrivate.prototype.getSpotOrder = function(order_id) {
  const path="/spot/order/" + order_id;
  return this.getQuery(path, {});
};

HitbtcPrivate.prototype.createSpotOrder = function(options={}) {
  var path="/spot/order";
  return this.otherQuery("POST",path,options);
};

HitbtcPrivate.prototype.createSpotOrderList = function(options={}) {
  var path="/spot/order/list";
  return this.otherQuery("POST",path,options);
};

HitbtcPrivate.prototype.replaceSpotOrder = function(order_id, options={}) {
  var path="/spot/order/" + order_id;
  return this.otherQuery("PATCH",path,options);
};

HitbtcPrivate.prototype.cancelSpotOrders = function() {
  const path="/spot/order";
  return this.otherQuery("DELETE",path, {});
};

HitbtcPrivate.prototype.cancelSpotOrder = function(order_id) {
  const path="/spot/order/" + order_id;
  return this.otherQuery("DELETE",path, {});
};

HitbtcPrivate.prototype.getSpotFees = function() {
  const path="/spot/fee";
  return this.getQuery(path, {});
};

HitbtcPrivate.prototype.getSpotFee = function(symbol) {
  const path="/spot/fee/" + symbol;
  return this.getQuery(path, {});
};

//
// SPOT Trading History
//

HitbtcPrivate.prototype.getSpotOrderHistory = function(options={}) {
  const path="/spot/history/order";
  return this.getQuery(path, options);
};

HitbtcPrivate.prototype.getSpotTradeHistory = function(options={}) {
  const path="/spot/history/trade";
  return this.getQuery(path, options);
};

//
// MARGIN Trading
// 

HitbtcPrivate.prototype.getMarginAccounts = function() {
  const path="/margin/account";
  return this.getQuery(path, {});
};

HitbtcPrivate.prototype.getMarginAccount = function(symbol) {
  const path="/margin/account/isolated/" + symbol;
  return this.getQuery(path, {});
};

HitbtcPrivate.prototype.getCrossMarginAccount = function(symbol) {
  const path="/margin/account/cross/" + symbol;
  return this.getQuery(path, {});
};

HitbtcPrivate.prototype.createUpdateMarginAccount = function(mode, instrument, options={}) {
  const path="/margin/account/"+mode+"/"+instrument;
  return this.otherQuery("PUT",path, options);
};

HitbtcPrivate.prototype.closeMarginPositions = function() {
  const path="/margin/position";
  return this.otherQuery("DELETE",path, {});
};

HitbtcPrivate.prototype.closeMarginPosition = function(symbol,options={}) {
  const path="/margin/position/isolated/" + symbol;
  return this.otherQuery("DELETE",path, options);
};

HitbtcPrivate.prototype.getMarginOrders = function(options={}) {
  const path="/margin/order";
  return this.getQuery(path, options);
};

HitbtcPrivate.prototype.getMarginOrder = function(order_id) {
  const path="/margin/order/" + order_id;
  return this.getQuery(path, {});
};

HitbtcPrivate.prototype.createMarginOrder = function(options={}) {
  const path="/margin/order";
  return this.otherQuery("POST",path, options);
};

HitbtcPrivate.prototype.createMarginOrderList = function(options={}) {
  const path="/margin/order/list";
  return this.otherQuery("POST",path, options);
};

HitbtcPrivate.prototype.replaceMarginOrder = function(order_id, options={}) {
  const path="/margin/order/" + order_id;
  return this.otherQuery("PATCH",path, options);
};

HitbtcPrivate.prototype.cancelMarginOrders = function() {
  const path="/margin/order";
  return this.otherQuery("DELETE",path, {});
};

HitbtcPrivate.prototype.cancelMarginOrder = function(order_id) {
  const path="/margin/order/" + order_id;
  return this.otherQuery("DELETE",path, {});
};

HitbtcPrivate.prototype.getMarginConfig = function() {
  const path="/margin/config";
  return this.getQuery(path, {});
};

//
// MARGIN Trading History
//

HitbtcPrivate.prototype.getMarginOrderHistory = function(options={}) {
  const path="/margin/history/order";
  return this.getQuery(path, options);
};

HitbtcPrivate.prototype.getMarginTradeHistory = function(options={}) {
  const path="/margin/history/trade";
  return this.getQuery(path, options);
};

HitbtcPrivate.prototype.getMarginPositionsHistory = function(options={}) {
  const path="/margin/history/positions";
  return this.getQuery(path, options);
};

HitbtcPrivate.prototype.getMarginClearingDetails = function(options={}) {
  const path="/margin/history/clearing";
  return this.getQuery(path, options);
};

//
// FUTURES Trading
//

HitbtcPrivate.prototype.getFuturesBalance = function() {
  const path="/futures/balance";
  return this.getQuery(path, {});
};

HitbtcPrivate.prototype.getFuturesAccounts = function() {
  const path="/futures/account";
  return this.getQuery(path, {});
};

HitbtcPrivate.prototype.getFuturesAccount = function(symbol) {
  const path="/futures/account/isolated/" + symbol;
  return this.getQuery(path, {});
};

HitbtcPrivate.prototype.getFuturesCrossAccount = function(symbol) {
  const path="/futures/account/cross/" + symbol;
  return this.getQuery(path, {});
};

HitbtcPrivate.prototype.createUpdateFuturesAccount = function(mode,symbol,options={}) {
  const path="/futures/account/"+mode+"/"+symbol;
  return this.otherQuery("PUT",path, options);
};

HitbtcPrivate.prototype.closeFuturesPositions = function() {
  const path="/futures/position";
  return this.otherQuery("DELETE",path, {});
};

HitbtcPrivate.prototype.closeFuturesPosition = function(symbol,options={}) {
  const path="/futures/position/isolated/" + symbol;
  return this.otherQuery("DELETE",path, options);
};

HitbtcPrivate.prototype.getFuturesOrders = function(options={}) {
  const path="/futures/order";
  return this.getQuery(path, options);
};

HitbtcPrivate.prototype.getFuturesOrder = function(order_id) {
  const path="/futures/order/" + order_id;
  return this.getQuery(path, {});
};

HitbtcPrivate.prototype.createFuturesOrder = function(options={}) {
  const path="/futures/order";
  return this.otherQuery("POST",path, options);
};

HitbtcPrivate.prototype.createFuturesOrderList = function(options={}) {
  const path="/futures/order/list";
  return this.otherQuery("POST",path, options);
};

HitbtcPrivate.prototype.replaceFuturesOrder = function(order_id, options={}) {
  const path="/futures/order/" + order_id;
  return this.otherQuery("PATCH",path, options);
};

HitbtcPrivate.prototype.cancelFuturesOrders = function() {
  const path="/futures/order";
  return this.otherQuery("DELETE",path, {});
};

HitbtcPrivate.prototype.cancelFuturesOrder = function(order_id) {
  const path="/futures/order/" + order_id;
  return this.otherQuery("DELETE",path, {});
};

HitbtcPrivate.prototype.getFuturesConfig = function() {
  const path="/futures/config";
  return this.getQuery(path, {});
};

HitbtcPrivate.prototype.getFuturesFees = function() {
  const path="/futures/fee";
  return this.getQuery(path, {});
};

HitbtcPrivate.prototype.getFuturesFee = function(symbol) {
  const path="/futures/fee/" + symbol;
  return this.getQuery(path, {});
};

//
// FUTURES Trading History
//

HitbtcPrivate.prototype.getFuturesOrderHistory = function(options={}) {
  const path="/futures/history/order";
  return this.getQuery(path, options);
};

HitbtcPrivate.prototype.getFuturesTradeHistory = function(options={}) {
  const path="/futures/history/trade";
  return this.getQuery(path, options);
};

HitbtcPrivate.prototype.getFuturesPositionsHistory = function(options={}) {
  const path="/futures/history/positions";
  return this.getQuery(path, options);
};

HitbtcPrivate.prototype.getFuturesClearingDetails = function(options={}) {
  const path="/futures/history/clearing";
  return this.getQuery(path, options);
};

//
// WALLET Management
//

HitbtcPrivate.prototype.getWalletBalance = function() {
  const path="/wallet/balance";
  return this.getQuery(path, {});
};

HitbtcPrivate.prototype.getDepositAddress = function(options={}) {
  const path="/wallet/crypto/address";
  return this.getQuery(path, options);
};

HitbtcPrivate.prototype.createDepositAddress = function(options={}) {
  const path="/wallet/crypto/address";
  return this.otherQuery("POST",path, options);
};

HitbtcPrivate.prototype.getRecentDepositAddresses = function(options={}) {
  const path="/wallet/crypto/address/recent-deposit";
  return this.getQuery(path, options);
};

HitbtcPrivate.prototype.getRecentWithdrawAddresses = function(options={}) {
  const path="/wallet/crypto/address/recent-withdraw";
  return this.getQuery(path, options);
};

HitbtcPrivate.prototype.withdrawCrypto = function(options={}) {
  const path="/wallet/crypto/withdraw";
  return this.otherQuery("POST",path, options);
};

HitbtcPrivate.prototype.convertCrypto = function(options={}) {
  const path="/wallet/crypto/withdraw";
  return this.otherQuery("POST",path, options);
};

HitbtcPrivate.prototype.withdrawCommit = function(id) {
  const path="/wallet/crypto/withdraw/" + id;
  return this.otherQuery("POST",path, {});
};

HitbtcPrivate.prototype.withdrawRollback = function(id) {
  const path="/wallet/crypto/withdraw/" + id;
  return this.otherQuery("DELETE",path, {});
};

HitbtcPrivate.prototype.checkMine = function(addr) {
  const path="/wallet/crypto/address/check-mine/" + addr;
  return this.getQuery(path, {});
};

HitbtcPrivate.prototype.transferExchange = function(options={}) {
  const path="/wallet/transfer";
  return this.otherQuery("POST",path, options);
};

HitbtcPrivate.prototype.transferInternal = function(options={}) {
  const path="/wallet/internal/withdraw";
  return this.otherQuery("POST",path, options);
};

HitbtcPrivate.prototype.getTransactions = function(options={}) {
  const path="/wallet/transactions";
  return this.getQuery(path, options);
};

HitbtcPrivate.prototype.getTransaction = function(id) {
  const path="/wallet/transactions/" + id;
  return this.getQuery(path, {});
};

HitbtcPrivate.prototype.checkOffchainAvailable = function(options={}) {
  const path="/wallet/crypto/check-offchain-available";
  return this.getQuery(path, options);
};

HitbtcPrivate.prototype.getWithdrawFees = function(options={}) {
  const path="/wallet/crypto/fees/estimate";
  return this.getQuery(path,options);
};

HitbtcPrivate.prototype.getWithdrawFee = function(options={}) {
  const path="/wallet/crypto/fee/estimate";
  return this.getQuery(path,options);
};

HitbtcPrivate.prototype.getAirDrops = function(options={}) {
  const path="/wallet/airdrops";
  return this.getQuery(path,options);
};

HitbtcPrivate.prototype.getAmountLocks = function(options={}) {
  const path="/wallet/amount-locks";
  return this.getQuery(path,options);
};

//
// SUB-ACCOUNTS Management
//

HitbtcPrivate.prototype.getSubaccounts = function() {
  const path="/sub-account";
  return this.getQuery(path, {});
};

HitbtcPrivate.prototype.freezeSubaccount = function(options={}) {
  const path="/sub-account/freeze";
  return this.otherQuery("POST",path, options);
};

HitbtcPrivate.prototype.activateSubaccount = function(options={}) {
  const path="/sub-account/activate";
  return this.otherQuery("POST",path, options);
};

HitbtcPrivate.prototype.transferFunds = function(options={}) {
  const path="/sub-account/transfer";
  return this.otherQuery("POST",path, options);
};

HitbtcPrivate.prototype.getACL = function(options={}) {
  const path="/sub-account/acl";
  return this.getQuery(path, options);
};

HitbtcPrivate.prototype.changeACL = function(options={}) {
  const path="/sub-account/acl";
  return this.otherQuery("POST",path, options);
};

HitbtcPrivate.prototype.getSubaccountBalance = function(id) {
  const path="/sub-account/balance/" + id;
  return this.getQuery(path, {});
};

HitbtcPrivate.prototype.getSubaccountAddress = function(id, currency) {
  var path="/sub-account/crypto/address/" + id + "/" + currency;
  return this.getQuery(path, {});
};
