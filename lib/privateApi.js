var rp = require('request-promise');
var crypto = require('crypto');
var querystring = require('querystring');

var BitbankccPrivate = function(apiKey, apiSecret) {
  this.endPoint = "https://api.hitbtc.com/api/2";
  this.apiKey = apiKey;
  this.apiSecret = apiSecret;
  this.timeout = 5000;
  this.keepalive = false;
};

var privateApi = module.exports = function(apiKey, apiSecret) {
  return new BitbankccPrivate(apiKey, apiSecret);
};

BitbankccPrivate.prototype.query = function(options) {
  return rp(options).then(function(json) {
    return json
  }).catch(function(err) {
    console.log(err);
    throw new Error(err.statusCode);
  });
};

BitbankccPrivate.prototype.getQuery = function(path, query) {
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

BitbankccPrivate.prototype.postQuery = function(path, query) {
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

BitbankccPrivate.prototype.deleteQuery = function(path, query) {
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

BitbankccPrivate.prototype.getAsset = function() {
  return this.getQuery("/trading/balance", {});
};

BitbankccPrivate.prototype.getOrder = function(order_id) {
  return this.getQuery("/order/" + order_id, {});
};

BitbankccPrivate.prototype.getActiveOrders = function(symbol, options) {
  var q = Object.assign({ "symbol": symbol }, options);
  return this.getQuery("/order", q);
};

BitbankccPrivate.prototype.order = function(symbol, price, quantity, side) {
  return this.postQuery("/order", {
    "symbol": symbol,
    "price": price,
    "quantity": quantity,
    "side": side
  });
};

BitbankccPrivate.prototype.cancelOrder = function(orderId) {
  return this.deleteQuery("/order/" + orderId, {});
};

BitbankccPrivate.prototype.cancelOrders = function(symbol) {
  return this.deleteQuery("/order", {
    "symbol": symbol
  });
};
