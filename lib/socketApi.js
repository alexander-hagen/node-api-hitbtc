const
  util = require('util'),
  WebSocket = require('ws');

const publicUrl = 'wss://api.hitbtc.com/api/2/ws/public';
const tradingUrl = 'wss://api.hitbtc.com/api/2/ws/trading';
const walletUrl = 'wss://api.hitbtc.com/api/2/ws/wallet';

const logger = {
  debug: (...arg) => {
    // console.log((new Date).toISOString(), 'DEBUG', ...arg)
  },
  info: (...arg) => {
    console.log((new Date).toISOString(), 'INFO', ...arg)
  },
  warn: (...arg) => {
    console.log((new Date).toISOString(), 'WARN', ...arg)
  },
  error: (...arg) => {
    console.log((new Date).toISOString(), 'ERROR', ...arg)
  }
};

class SocketClient {

  constructor(url, onConnected) {
    this._id = 1; // Request ID, incrementing
    this._onConnected = onConnected;
    this._createSocket(url);
    this._promises = new Map();
    this._handles = new Map();
  }

  _createSocket(url) {
    this._ws = new WebSocket(url);

    this._ws.onopen = async () => {
      setInterval( () => { this._ws.ping( () => {}) } , 30000); // keep socket alive
      if(this._onConnected!==undefined) { this._onConnected(); };
    };

    this._ws.onclose = () => {
      this._promises.forEach((cb, id) => {
        this._promises.delete(id);
        cb.reject(new Error('Disconnected'));
      });
      setTimeout(() => this._createSocket(this._ws._url), 500);
    };

    this._ws.onerror = err => {
      logger.warn('ws error', err);
    };

    this._ws.onmessage = msg => {
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

//  var config=this.user;

  this.pingTimeout = setTimeout(() => {
    this.terminate();
  }, 30000 + 1000);

}


var HitbtcSocket = function(url, keys) {
  this.baseURL = url;
  this.timeout = 5000;
  this.initialized = false;
  this.authenticated = false;
  this.socket = new SocketClient(url, () => {
    this.initialized=true;
    if(keys!=undefined) { this.login(this, keys); } else { this.socket._ws.emit('initialized'); };
  });
};


HitbtcSocket.prototype.login = async function(ws, keys) {

  try {
    const result = await ws.socket.request('login', {
      "algo": "BASIC",
      "pKey": keys.apikey,
      "sKey": keys.secret
    });
    ws.authenticated=true;
    logger.info('ws authenticated');
    ws.socket._ws.emit('authenticated');
    return result;
  }
  catch(e) {
    logger.error('login failed', e);
  };
};

module.exports = {
  publicApi: function(keys) { return new HitbtcSocket(publicUrl, keys); },
  tradingApi: function(keys) { return new HitbtcSocket(tradingUrl, keys); },
  walletApi: function(keys) { return new HitbtcSocket(walletUrl, keys); }
};

HitbtcSocket.prototype.setHandler = function(method, callback) {
  this.socket.setHandler(method, callback);
};

//
// PUBLIC WebSocket functions
//

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

HitbtcSocket.prototype.subscribeTicker = function(market) { // async
  this.socket.request('subscribeTicker', {"symbol": market});
};

HitbtcSocket.prototype.unsubscribeTicker = function(market) { // async
  this.socket.request('unsubscribeTicker', {"symbol": market});
};

HitbtcSocket.prototype.subscribeOrderbook = function(market) { // async
  this.socket.request('subscribeOrderbook', {"symbol": market});
};

HitbtcSocket.prototype.unsubscribeOrderbook = function(market) { // async
  this.socket.request('unsubscribeOrderbook', {"symbol": market});
};

HitbtcSocket.prototype.subscribeTrades = function(market,limit) { // async
  this.socket.request('subscribeTrades', {"symbol": market, "limit": limit});
};

HitbtcSocket.prototype.unsubscribeTrades = function(market) { // async
  this.socket.request('unsubscribeTrades', {"symbol": market});
};

HitbtcSocket.prototype.getTrades = async function(symbol, limit, offset, sort, by) { // async
  try {
    var options={};
    if(symbol!==undefined) { options["symbol"]=symbol; };
    if(limit!==undefined) { options["limit"]=limit; };
    if(offset!==undefined) { options["offset"]=offset; };
    if(sort!==undefined) { options["sort"]=sort; };
    if(by!==undefined) { options["by"]=by; };

    result=await this.socket.request('getTrades', options);
  }
  catch(e) {
    logger.error('getTrades failed', e);
    return null;
  };
};

HitbtcSocket.prototype.subscribeCandles = function(market,period,limit) { // async
  this.socket.request('subscribeCandles', {"symbol": market, "period":period, "limit": limit});
};

HitbtcSocket.prototype.unsubscribeCandles = function(market) { // async
  this.socket.request('unsubscribeCandles', {"symbol": market});
};


//
// TRADING WebSocket functions
//

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
  }
  catch(e) {
    switch(e.code) {
      case 20001:
      case 20008: logger.error('newOrder failed', e); break;
      default: break;
    };
    return null;
  };

};

HitbtcSocket.prototype.cancelOrder = async function(clientOrderId) { // async

  try {
    const result = await this.socket.request('cancelOrder', { "clientOrderId": clientOrderId });
    return result;
  }
  catch(e) {
    switch(e.code) {
      case 20001:
      case 20008:
      default: logger.error('cancelOrder failed', e);break;
    };
    return null;
  };

};

HitbtcSocket.prototype.cancelReplaceOrder = async function(clientOrderId, newOrderId, price, quantity) { // async

  try {
    const result = await this.socket.request('cancelReplaceOrder', {
      "clientOrderId": clientOrderId,
      "requestClientId": newOrderId,
      "quantity": quantity,
      "price": price,
      "strictValidate": false
    });
    return result;
  }
  catch(e) {
    switch(e.code) {
      case 20001:
      case 20008: logger.error('cancelReplaceOrder failed', e);
      default: break;
    };
    return null;
  };

};

HitbtcSocket.prototype.getOrders = async function() { // sync
  try {
    const result = await this.socket.request('getOrders', { });
    return result;
  }
  catch(e) {
    logger.error('getOrders failed', e);
    return null;
  };
};

HitbtcSocket.prototype.getTradingBalance = async function() { // sync
  try {
    const result = await this.socket.request('getTradingBalance', { });
    return result;
  }
  catch(e) {
    logger.error('getTradingBalance failed', e);
    return null;
  };
};


//
// SOCKET MARGIN TRADING WebSocket functions (Trading EndPoint)
//

HitbtcSocket.prototype.marginSubscribe = function() { // Notifications: marginOrders, marginAccounts, marginAccountReport, marginOrderReport 
  this.socket.request('marginSubscribe', {});
};

HitbtcSocket.prototype.marginAccountsGet = function() { // Notifications: marginAccountReport
  this.socket.request('marginAccountsGet', {});
};

HitbtcSocket.prototype.marginAccountSet = function(symbol, balance, validate) {
  var options={ "symbol": symbol, "marginBalance": balance };
  if(validate!==undefined) { options["strictValidate"]=validate; };

  this.socket.request('marginAccountSet', options);
};

HitbtcSocket.prototype.marginPositionClose = function(symbol) { // Notifications: marginAccountReport
  this.socket.request('marginPositionClose', { "symbol": symbol});
};

HitbtcSocket.prototype.marginOrdersGet = function(symbol) {
  this.socket.request('marginOrdersGet', {});
};

HitbtcSocket.prototype.marginOrdersCancel = function(symbol) {
  this.socket.request('marginOrdersCancel', {});
};

HitbtcSocket.prototype.marginOrderNew = function(orderid, symbol, price, quantity, side) {
  try {
    return this.socket.request('marginOrderNew', {
      "symbol": symbol,
      "side": side,
      "quantity": quantity,
      "price": price,
      "clientOrderId": orderid });
  }
  catch(e) {
    logger.error('marginOrderNew failed', e);
    return null;
  };
};

HitbtcSocket.prototype.marginOrderCancel = function(orderid) {
  this.socket.request('marginOrdersCancel', { "clientOrderId": orderid });
};

HitbtcSocket.prototype.marginOrderCancelReplace = function(orderid, price, quantity, neworderid) {
  try {
    return this.socket.request('marginOrderNew', {
      "quantity": quantity,
      "price": price,
      "clientOrderId": orderid,
      "requestClientId": neworderid });
  }
  catch(e) {
    logger.error('marginOrderCancelReplace failed', e);
    return null;
  };
};


//
// WALLET Socket Functions
//

HitbtcSocket.prototype.subscribeTransactions = function() {
  this.socket.request('subscribe_transactions', {});
};

HitbtcSocket.prototype.unsubscribeTransactions = function() {
  this.socket.request('unsubscribe_transactions', {});
};

HitbtcSocket.prototype.subscribeWalletBalances = function() {
  this.socket.request('subscribe_wallet_balances', {});
};

HitbtcSocket.prototype.unsubscribeWalletBalances = function() {
  this.socket.request('unsubscribe_wallet_balances', {});
};

HitbtcSocket.prototype.getWalletBalances = async function() { // sync
  try {
    const result = await this.socket.request('wallet_balances', {});
    return result;
  }
  catch(e) {
    logger.error('getWalletBalances failed', e);
    return null;
  };
};

HitbtcSocket.prototype.getWalletBalance = async function() { // sync
  try {
    const result = await this.socket.request('wallet_balance', {});
    return result;
  }
  catch(e) {
    logger.error('getWalletBalance failed', e);
    return null;
  };
};

HitbtcSocket.prototype.getTransactions = async function(options) {
  try {
    const result = await this.socket.request('get_transactions', options);
    return result;
  }
  catch(e) {
    logger.error('getTransactions failed', e);
    return null;
  };
};
