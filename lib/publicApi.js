var rp = require('request-promise');

var HitbtcPublic = function() {
  this.endPoint = "https://api.hitbtc.com";
  this.timeout = 5000;
  this.keepalive = false;
};

HitbtcPublic.prototype.query = function(option) {
  return rp({
      uri: option,
      method: "GET",
      timeout: this.timeout,
      forever: this.keepalive,
    })
    .then(function(res) {
      var json = JSON.parse(res);
      return json;
    })
    .catch(function(err) {
      console.log("Error: " + err);
      throw new Error(err.statusCode);
    });
};

HitbtcPublic.prototype.getTicker = function(pair) {
  var path = "/api/2/public/ticker/" + pair ;
  return this.query(this.endPoint + path);
};

HitbtcPublic.prototype.getOrderBook = function(pair) {
  var path = "/api/2/public/orderbook/" + pair ;
  return this.query(this.endPoint + path);
};

HitbtcPublic.prototype.getTrades = function(pair, sort) {
  var path = "/api/2/public/trades/" + pair ;
  if (sort !== undefined) {
    path = path + "?sort=" + sort;
  }
  return this.query(this.endPoint + path);
};

HitbtcPublic.prototype.getCandlestick = function(pair, period) {
  var path = "/api/2/public/candles/" + pair ;
  if (period !== undefined) {
    path = path + "?period=" + period;
  }
  return this.query(this.endPoint + path);
};

var publicApi = module.exports = function() {
  return new HitbtcPublic();
};
