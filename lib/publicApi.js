var axios = require('axios');

var HitbtcPublic = function() {
  this.endPoint = "https://api.hitbtc.com/api/3";
  this.timeout = 5000;
  this.keepalive = false;
};

HitbtcPublic.prototype.query = async function(path) {
  const request={
      url: this.endPoint + path,
      method: "GET",
      timeout: this.timeout,
      forever: this.keepalive
    };
  return result=await axios(request)
    .then(function(res) {
      return res.data;
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
  };
  return this.query(path);
};

HitbtcPublic.prototype.getTicker = function(symbols) {
  var path = "/public/ticker" ;
  if (symbols !== undefined) {
    path = path + "/" + symbols;
  };
  return this.query(path);
};

HitbtcPublic.prototype.getPrices = function(from,to) {
  var path = "/public/price/rate" ;
  var separator = "?"
  if (from !== undefined) {
    path = path + separator + "from=" + from;
    separator="&";
  };
  if (to !== undefined) {
    path = path + separator + "to=" + to;
    separator="&";
  };
  return this.query(path);
};

HitbtcPublic.prototype.getPricesHistory = function(from,to,until,since,limit,period,sort) {
  var path = "/public/price/history" ;
  var separator = "?"
  if (from !== undefined) {
    path = path + separator + "from=" + from;
    separator="&";
  };
  if (to !== undefined) {
    path = path + separator + "to=" + to;
    separator="&";
  };
  if (until !== undefined) {
    path = path + separator + "until=" + until;
    separator="&";
  };
  if (since !== undefined) {
    path = path + separator + "since=" + since;
    separator="&";
  };
  if (limit !== undefined) {
    path = path + separator + "limit=" + limit;
    separator="&";
  };
  if (period !== undefined) {
    path = path + separator + "period=" + period;
    separator="&";
  };
  if (sort !== undefined) {
    path = path + separator + "sort=" + sort;
    separator="&";
  };
  return this.query(path);
};

HitbtcPublic.prototype.getTickerLastPrices = function(symbols) {
  var path = "/public/price/ticker" ;
  if (symbols !== undefined) {
    path = path + "/" + symbols;
  };
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

HitbtcPublic.prototype.getOrderBook = function(symbols, depth, volume) {
  var path = "/public/orderbook/" + symbols ;
  var separator="?";
  if (depth !== undefined) {
    path = path + separator + "depth=" + depth;
    separator="&";
  };
  if (volume !== undefined) {
    path = path + separator + "volume=" + volume;
    separator="&";
  }
  return this.query(path);
};

HitbtcPublic.prototype.getCandles = function(symbols, sort, period, from, till, limit, offset) {
  var path = "/public/candles/" + symbols ;
  var separator="?";
  if (sort !== undefined) {
    path = path + separator + "sort=" + sort;
    separator="&";
  };
  if (period !== undefined) {
    path = path + separator + "period=" + period;
    separator="&";
  }
  if (from !== undefined) {
    path = path + separator + "from=" + from;
    separator="&";
  };
  if (till !== undefined) {
    path = path + separator + "till=" + till;
    separator="&";
  };
  if (limit !== undefined) {
    path = path + separator + "limit=" + limit;
    separator="&";
  };
  if (offset !== undefined) {
    path = path + separator + "offset=" + limit;
    separator="&";
  };
  return this.query(path);
};

HitbtcPublic.prototype.getFuturesInformation = function(symbols) {
  var path = "/public/futures/info";
  if (symbols !== undefined) { 
    path = path + "/" + symbols;
  };
  return this.query(path);
};

HitbtcPublic.prototype.getIndexPriceCandles = function(symbols,sort,period,from,till,limit,offset) {
  var path = "/public/futures/candles/index_price";
  if (symbols !== undefined) { 
    path = path + "/" + symbols;
  };
  var separator="?";
  if (sort !== undefined) {
    path = path + separator + "sort=" + sort;
    separator="&";
  };
  if (period !== undefined) {
    path = path + separator + "period=" + period;
    separator="&";
  };
  if (from !== undefined) {
    path = path + separator + "from=" + from;
    separator="&";
  };
  if (till !== undefined) {
    path = path + separator + "till=" + till;
    separator="&";
  };
  if (limit !== undefined) {
    path = path + separator + "limit=" + limit;
    separator="&";
  };
  if (offset !== undefined) {
    path = path + separator + "offet=" + offset;
    separator="&";
  };
  return this.query(path);
};

HitbtcPublic.prototype.getmarkPriceCandles = function(symbols,sort,period,from,till,limit,offset) {
  var path = "/public/futures/candles/mark_price";
  if (symbols !== undefined) { 
    path = path + "/" + symbols;
  };
  var separator="?";
  if (sort !== undefined) {
    path = path + separator + "sort=" + sort;
    separator="&";
  };
  if (period !== undefined) {
    path = path + separator + "period=" + period;
    separator="&";
  };
  if (from !== undefined) {
    path = path + separator + "from=" + from;
    separator="&";
  };
  if (till !== undefined) {
    path = path + separator + "till=" + till;
    separator="&";
  };
  if (limit !== undefined) {
    path = path + separator + "limit=" + limit;
    separator="&";
  };
  if (offset !== undefined) {
    path = path + separator + "offet=" + offset;
    separator="&";
  };
  return this.query(path);
};

HitbtcPublic.prototype.getPremiumIndexCandles = function(symbols,sort,period,from,till,limit,offset) {
  var path = "/public/futures/candles/premium_index";
  if (symbols !== undefined) { 
    path = path + "/" + symbols;
  };
  var separator="?";
  if (sort !== undefined) {
    path = path + separator + "sort=" + sort;
    separator="&";
  };
  if (period !== undefined) {
    path = path + separator + "period=" + period;
    separator="&";
  };
  if (from !== undefined) {
    path = path + separator + "from=" + from;
    separator="&";
  };
  if (till !== undefined) {
    path = path + separator + "till=" + till;
    separator="&";
  };
  if (limit !== undefined) {
    path = path + separator + "limit=" + limit;
    separator="&";
  };
  if (offset !== undefined) {
    path = path + separator + "offet=" + offset;
    separator="&";
  };
  return this.query(path);
};

var publicApi = module.exports = function() {
  return new HitbtcPublic();
};
