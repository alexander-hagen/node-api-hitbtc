const
  util = require('util'),
  WebSocket = require('ws');

const baseUrl = 'wss://api.hitbtc.com/api/2/ws';

const logger = {
  debug: (...arg) => {
    // console.log((new Date).toISOString(), 'DEBUG', ...arg)
  },
  info: (...arg) => {
    console.log((new Date).toISOString(), 'INFO', ...arg)
  },
  warn: (...arg) => {
    console.log((new Date).toISOString(), 'WARN', ...arg)
  }
};

class SocketClient {

  constructor(onConnected) {
    this._id = 1; // Request ID, incrementing
    this._createSocket();
    this._onConnected = onConnected;
    this._promises = new Map();
    this._handles = new Map();
//    this._alive = true;
  }

  _createSocket() {
    this._ws = new WebSocket(baseUrl);

    this._ws.onopen = () => {
      logger.info('ws connected');
      this._onConnected();
//      this._ws.user = undefined;
    };

    this._ws.onclose = () => {
      logger.warn('ws closed');
      this._promises.forEach((cb, id) => {
        this._promises.delete(id);
        cb.reject(new Error('Disconnected'));
      });
      setTimeout(() => this._createSocket(), 500);
    };

    this._ws.onerror = err => {
      logger.warn('ws error', err);
    };

    this._ws.onmessage = msg => {
      logger.debug('<', msg.data);
      try {
        const message = JSON.parse(msg.data);
        if (message.id) {
          if (this._promises.has(message.id)) {
            const cb = this._promises.get(message.id);
            this._promises.delete(message.id);
            if (message.result) {
              cb.resolve(message.result);
            } else if (message.error) {
              cb.reject(message.error);
            } else {
              logger.warn('Unprocessed response', message)
            }
          }
        } else {
          if (message.method && message.params) {
            if (this._handles.has(message.method)) {
              this._handles.get(message.method).forEach(cb => {
                cb(message.params);
              });
            } else {
              logger.warn('Unprocessed method', message);
            }
          } else {
            logger.warn('Unprocessed message', message);
          }
        }
      } catch (e) {
        logger.warn('Fail parse message', e);
      }
    };
    this._ws.on('ping', heartbeat);
  }

  request(method, params = {}) {
    if (this._ws.readyState === WebSocket.OPEN) {
      return new Promise((resolve, reject) => {
        const requestId = ++this._id;
        this._promises.set(requestId, {resolve, reject});
        const msg = JSON.stringify({method, params, id: requestId});
        logger.debug('>', msg);
        this._ws.send(msg);
        setTimeout(() => {
          if (this._promises.has(requestId)) {
            this._promises.delete(requestId);
            reject(new Error('Timeout'));
          }
        }, 10000);
      });

    } else {
      return Promise.reject(new Error('WebSocket connection not established'))
    }

  }

  setHandler(method, callback) {
    if (!this._handles.has(method)) { this._handles.set(method, []); };
    this._handles.get(method).push(callback);
  }

}

function heartbeat() {

  clearTimeout(this.pingTimeout);

  // Use `WebSocket#terminate()`, which immediately destroys the connection,
  // instead of `WebSocket#close()`, which waits for the close timer.
  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.

  var config=this.user;

  this.pingTimeout = setTimeout(() => {
    this.terminate();
  }, 30000 + 1000);

}

var HitbtcSocket = function(keys) {
  this.baseURL = baseUrl;
  this.timeout = 5000;
  this.initialized = false;
  this.authenticated = false;
  this.socket = new SocketClient(async () => {
    this.initialized=true;
    if(keys!=undefined) { this.login(keys); };
  });
};

var socketApi = module.exports = function(keys) {
  return new HitbtcSocket(keys);
};

HitbtcSocket.prototype.setHandler = function(method, callback) {
  this.socket.setHandler(method, callback);
};

HitbtcSocket.prototype.getCurrencies = async function() {
  const currencies = await this.socket.request('getCurrencies');
  return currencies;
};

HitbtcSocket.prototype.getCurrency = async function(symbol) {
  const currency = await this.socket.request('getCurrency', {"currency": symbol});
  return currency;
};

HitbtcSocket.prototype.getSymbols = async function() {
  const symbols = await this.socket.request('getSymbols');
  return symbols;
};

HitbtcSocket.prototype.getSymbol = async function(market) {
  const symbol = await this.socket.request('getSymbol', {"symbol": market});
  return symbol;
};

//
// Public Socket API's
//

HitbtcSocket.prototype.subscribeOrderbook = function(market) { // async
  this.socket.request('subscribeOrderbook', {"symbol": market});
};

HitbtcSocket.prototype.unsubscribeOrderbook = function(market) { // async
  this.socket.request('unsubscribeOrderbook', {"symbol": market});
};

HitbtcSocket.prototype.subscribeTicker = function(market) { // async
  this.socket.request('subscribeTicker', {"symbol": market});
};

HitbtcSocket.prototype.unsubscribeTicker = function(market) { // async
  this.socket.request('unsubscribeTicker', {"symbol": market});
};

HitbtcSocket.prototype.subscribeTrades = function(market,limit) { // async
  this.socket.request('subscribeTrades', {"symbol": market, "limit": limit});
};

HitbtcSocket.prototype.unsubscribeTrades = function(market) { // async
  this.socket.request('unsubscribeTrades', {"symbol": market});
};

HitbtcSocket.prototype.subscribeCandles = function(market,period,limit) { // async
  this.socket.request('subscribeCandles', {"symbol": market, "period":period, "limit": limit});
};

HitbtcSocket.prototype.unsubscribeCandles = function(market) { // async
  this.socket.request('unsubscribeCandles', {"symbol": market});
};


//
// Private Socket API's
//

HitbtcSocket.prototype.login = async function(keys) {

  try {
    const result = await this.socket.request('login', {
      "algo": "BASIC",
      "pKey": keys.apikey,
      "sKey": keys.secret
    });
    this.authenticated=true;
console.log("Auth:"+result);
    return result;
  }
  catch(e) {
    console.log("### Error caught (login): "+util.inspect(e));
  };
};

HitbtcSocket.prototype.getTradingBalance = async function() { // sync
  try {
    const result = await this.socket.request('getTradingBalance', { });
    return result;
  }
  catch(e) {
    console.log("### Error caught (getTradingBalance): "+e);
//    process.exit(0);
    return [];
  };
};

HitbtcSocket.prototype.getOrders = async function() { // sync
  try {
    const result = await this.socket.request('getOrders', { });
    return result;
  }
  catch(e) {
    console.log("### Error caught (getOrders): "+JSON.stringify(e));
//    process.exit(0);
    return [];
  };
};

HitbtcSocket.prototype.subscribeReports = function() { // async
  const result = this.socket.request('subscribeReports', { });
  return result;
};

HitbtcSocket.prototype.newOrder = async function(symbol, price, quantity, side, type, stopPrice, order_id) { // async

  try {
    const result = await this.socket.request('newOrder', {
      "clientOrderId": order_id,
      "symbol": symbol,
      "side": side,
      "type": type,
      "timeInForce": undefined,
      "quantity": quantity,
      "price": price,
      "stopPrice": stopPrice,
      "expireTime": undefined,
      "strictValidate": false,
      "postOnly": false
    });
    return result;
  } catch(e) {
    switch(e.code) {
      case 20001:
      case 20008: console.log("### Error caught (newOrder): "+JSON.stringify(e)+"\nADD: "+order_id+" ==> "+side.toUpperCase()+" "+quantity+" @ " +price); break;
      default: break;
    };
  };

  return null;

};

HitbtcSocket.prototype.cancelOrder = async function(clientOrderId) { // async

  try {
    const result = await this.socket.request('cancelOrder', { "clientOrderId": clientOrderId });
    return result;
  } catch(e) {
    switch(e.code) {
      case 20001:
      case 20008: console.log("### Error caught (cancelOrder): "+JSON.stringify(e)+"\nDEL: "+clientOrderId); break;
      default: console.log("### Error caught (cancelOrder): "+JSON.stringify(e)+"\nDEL: "+clientOrderId); break;
    };
  };

  return null;

};

HitbtcSocket.prototype.replaceOrder = async function(clientOrderId, newOrderId, price, quantity) { // async

  try {
    const result = await this.socket.request('cancelReplaceOrder', {
      "clientOrderId": clientOrderId,
      "requestClientId": newOrderId,
      "quantity": quantity,
      "price": price,
      "strictValidate": false
    });
    return result;
  } catch(e) {
    switch(e.code) {
      case 20001:
      case 20008: console.log("### Error caught (replaceOrder): "+JSON.stringify(e)+"\nREPL: "+clientOrderId+"/"+newOrderId+" ==> "+quantity+" @ " +price); break;
      default: break;
    };
  };

  return null;

};
