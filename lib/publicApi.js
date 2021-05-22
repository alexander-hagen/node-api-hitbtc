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

// Market Data

HitbtcPublic.prototype.getCurrency = function(currencies) {
  var path = "/public/currency" ;
  if (currencies !== undefined) {
    path = path + "/" + currencies;
  }
  return this.query(path);
};

HitbtcPublic.prototype.getSymbol = function(symbols) {
  var path = "/public/symbol" ;
  if (symbols !== undefined) { 
    path = path + "/" + symbols;
  }
  return this.query(path);
};

HitbtcPublic.prototype.getTicker = function(symbols) {
  var path = "/public/ticker" ;
  if (symbols !== undefined) {
    path = path + "/" + symbols;
  }
  return this.query(path);
};

HitbtcPublic.prototype.getTrades = function(symbols, sort, by, from, till, limit, offset) {
  var path = "/public/trades" + symbols ;
  if (symbols !== undefined) { 
    path = path + "/" + symbols;
  }
  var separator = "?"
  if (sort !== undefined) {
    path = path + separator + "sort=" + sort;
    separator="&";
  }
  if (by !== undefined) {
    path = path + separator + "by=" + by;
    separator="&";
  }
  if (from !== undefined) {
    path = path + separator + "from=" + from;
    separator="&";
  }
  if (till !== undefined) {
    path = path + separator + "till=" + till;
    separator="&";
  }
  if (limit !== undefined) {
    path = path + separator + "limit=" + limit;
    separator="&";
  }
  if (offset !== undefined) {
    path = path + separator + "offset=" + limit;
    separator="&";
  }
  return this.query(path);
};

HitbtcPublic.prototype.getOrderBook = function(symbols, limit, volume) {
  var path = "/public/orderbook/" + symbols ;
  var separator="?";
  if (limit !== undefined) {
    path = path + separator + "limit=" + limit;
    separator="&";
  }
  if (volume !== undefined) {
    path = path + separator + "volume=" + volume;
    separator="&";
  }
  return this.query(path);
};

HitbtcPublic.prototype.getCandlestick = function(symbols, period, limit) {
  var path = "/public/candles/" + symbols ;
  var separator="?";
  if (period !== undefined) {
    path = path + separator + "period=" + period;
    separator="&";
  }
  if (sort !== undefined) {
    path = path + separator + "sort=" + sort;
    separator="&";
  }
  if (from !== undefined) {
    path = path + separator + "from=" + from;
    separator="&";
  }
  if (till !== undefined) {
    path = path + separator + "till=" + till;
    separator="&";
  }
  if (limit !== undefined) {
    path = path + separator + "limit=" + limit;
    separator="&";
  }
  if (offset !== undefined) {
    path = path + separator + "offset=" + limit;
    separator="&";
  }
  return this.query(path);
};

var publicApi = module.exports = function() {
  return new HitbtcPublic();
};
