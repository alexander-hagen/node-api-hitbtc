var rp = require('request-promise');
var crypto = require('crypto');
var querystring = require('querystring');

var HitbtcPrivate = function(apiKey, apiSecret) {
  this.endPoint = "https://api.hitbtc.com/api/2";
  this.apiKey = apiKey;
  this.apiSecret = apiSecret;
  this.timeout = 5000;
  this.keepalive = false;
};

var privateApi = module.exports = function(apiKey, apiSecret) {
  return new HitbtcPrivate(apiKey, apiSecret);
};

HitbtcPrivate.prototype.query = function(options) {
  return rp(options).then(function(json) {
    return json
  }).catch(function(err) {
    console.log(err);
    throw new Error(err.statusCode);
  });
};

HitbtcPrivate.prototype.getQuery = function(path, query) {
  var options = {
    uri: this.endPoint + path,
    qs: query,
    auth: {
        'user': this.apiKey,
        'pass': this.apiSecret
    },
    timeout: this.timeout,
    forever: this.keepalive,
    json: true
  };
  return this.query(options);
};

HitbtcPrivate.prototype.postQuery = function(path, query) {
  var data = JSON.stringify(query);
  var options = {
    method: "POST",
    uri: this.endPoint + path,
    auth: {
        'user': this.apiKey,
        'pass': this.apiSecret
    },
    body: query,
    json: true
  };
  return this.query(options);
};

HitbtcPrivate.prototype.deleteQuery = function(path, query) {
  var data = JSON.stringify(query);
  var options = {
    method: "DELETE",
    uri: this.endPoint + path,
    auth: {
        'user': this.apiKey,
        'pass': this.apiSecret
    },
    body: query,
    json: true
  };
  return this.query(options);
};

//
// Trading
//

HitbtcPrivate.prototype.getTradingBalance = function() {
  return this.getQuery("/trading/balance", {});
};

HitbtcPrivate.prototype.getActiveOrders = function(symbol, options) {
  var q = Object.assign({ "symbol": symbol }, options);
  return this.getQuery("/order", q);
};

HitbtcPrivate.prototype.getOrder = function(order_id) {
  return this.getQuery("/order/" + order_id, {});
};

HitbtcPrivate.prototype.order = function(symbol, price, quantity, side) {
  return this.postQuery("/order", {
    "symbol": symbol,
    "price": price,
    "quantity": quantity,
    "side": side
  });
};

HitbtcPrivate.prototype.cancelOrders = function(symbol) {
  return this.deleteQuery("/order", {
    "symbol": symbol
  });
};

HitbtcPrivate.prototype.cancelOrder = function(orderId) {
  return this.deleteQuery("/order/" + orderId, {});
};

HitbtcPrivate.prototype.getTradingFee = function(symbol) {
  return this.getQuery("/trading/fee/" + symbol, {});
};

//
// TO DO: Margin Trading
//

//
// TO DO: Trading History
//

HitbtcPrivate.prototype.getOrderHistory = function(order_id) {
  var q=Object.assign({ "clientOrderId": order_id }, q);

  return this.getQuery("/history/order", q);
};

HitbtcPrivate.prototype.getOrdersHistory = function(symbol, from, till, limit, offset) {
  var q=Object.assign( {} );
 
  if (symbol !== undefined) { q = Object.assign({ "symbol": symbol }, q); }
  if (from !== undefined) { q = Object.assign({ "from": from }, q); }
  if (till !== undefined) { q = Object.assign({ "till": till }, q); }
  if (limit !== undefined) { q = Object.assign({ "limit": limit }, q); }
  if (offset !== undefined) { q = Object.assign({ "offset": offset }, q); }

  return this.getQuery("/history/order", q);
};

HitbtcPrivate.prototype.getOrderTrades = function(order_id) {
  return this.getQuery("/history/order/"+order_id+"/trades", {});
};

//
// Account Management
//

HitbtcPrivate.prototype.getAccountBalance = function() {
  return this.getQuery("/account/balance", q);
};

HitbtcPrivate.prototype.getDepositAddress = function(currency) {
  return this.getQuery("/account/crypto/address/"+currency, {});
};

HitbtcPrivate.prototype.getLastAddresses = function(currency) {
  return this.getQuery("/account/crypto/addresses/"+currency, {});
};

HitbtcPrivate.prototype.getUsedAddresses = function(currency) {
  return this.getQuery("/account/crypto/used-addresses/"+currency, {});
};

// TO DO: crypto/withdraw

// TO DO: crypto/transfer

// TO DO: Withdraw commit/rollback

// TO DO: Estimate withdraw fee

// TO DO: crypto/is-mine





