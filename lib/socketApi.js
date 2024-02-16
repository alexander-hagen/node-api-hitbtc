const
  WebSocket = require('ws');

const
  marketUrl = 'wss://api.hitbtc.com/api/3/ws/public',
  tradingUrl = 'wss://api.hitbtc.com/api/3/ws/trading',
  walletUrl = 'wss://api.hitbtc.com/api/3/ws/wallet';

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
//      logger.info('ws connected');
      setInterval( () => { this._ws.ping( () => {}) } , 20000); // keep socket alive
      setInterval( () => {
        switch(this._ws.readyState) {
          case 1: this._ws.ping( () => {}); break;
          case 2: case 3: this._ws.terminate(); break;
          default: logger.info('ws ping pending. readyState='+this._ws.readyState); break;
        };
      } , 30000); // keep socket alive
      if(this._onConnected!==undefined) { this._onConnected(); };
    };

    this._ws.onclose = () => {
//      logger.warn('ws closed');
      this._ws.emit('closed');
      this._promises.forEach((cb, id) => {
        this._promises.delete(id);
//        cb.reject(new Error('Disconnected'));
      });
//      setTimeout(() => this._createSocket(this._ws._url), 500);
    };

    this._ws.onerror = err => {
//      logger.warn('ws error', err);
//      setTimeout(() => this._createSocket(this._ws._url), 500);
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
          } else { logger.warn('Promise already deleted', message.id) };
        } else {
          var key,data,method,period,parts;
          if (message.ch) {
            parts=message.ch.split("/");
            method=Object.keys(message)[1];
            data=method; key=parts[0]+(parts.length==3?"_"+parts[2]:"")+"_"+method;
            period=parts[1].toUpperCase();
          };
          if (message.method) {
            method=message.method;
            data=Object.keys(message)[2];
            key=method;
          };

          if(key) {
            if (this._handles.has(key)) {
              this._handles.get(key).forEach(cb => {
                cb(method,message[data],period);
              });
            } else {
              logger.warn('Unprocessed method:'+key, message);
            }
          } else {
            logger.warn('Unprocessed message', message);
          }
        }
      } catch (e) {
        logger.warn('Fail parse message', e);
      }
    };

    this._ws.on('ping', () => { heartbeat(this); });
  }

  request(method, ch, params = {}) {
    if (this._ws.readyState === WebSocket.OPEN) {
      return new Promise((resolve, reject) => {
        const requestId = ++this._id;
        this._promises.set(requestId, {resolve, reject});
        var data = {method, "ch":ch, params, "id":requestId};
        const msg = JSON.stringify(data);
        logger.debug('>', msg);
        this._ws.send(msg);
        setTimeout(() => {
          if (this._promises.has(requestId)) {
            this._promises.delete(requestId);
            reject({"code":"408","error":"Request Timeout"});
          }
        }, 10000);
      });

    } else {
      return Promise.reject(new Error('WebSocket connection not established'))
    }

  }

  setHandler(key, callback) {
    if (!this._handles.has(key)) { this._handles.set(key, []); };
    this._handles.get(key).push(callback);
  }

  clearHandler(key) {
    if (this._handles.has(key)) { this._handles.delete(key); };
  }

  clearHandlers() {
    this._handles.forEach((value,key,map) => { this.clearHandler(key); });
  }

}

function heartbeat(handler) {

  console.log("ping");
  clearTimeout(handler.pingTimeout)

  // Use `WebSocket#terminate()`, which immediately destroys the connection,
  // instead of `WebSocket#close()`, which waits for the close timer.
  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.

//  var config=this.user;

  handler.pingTimeout = setTimeout(() => {
    logger.debug("Terminate socket "+handler.readyState);
    handler._ws.terminate();
  }, 30000 + 5000);

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

HitbtcSocket.prototype.login = async function(ws, api) {

  try {
    const result = await ws.socket.request('login', undefined, {
      "type": "Basic",
      "api_key": api.apikey,
      "secret_key": api.secret
    });
    ws.authenticated=true;
    logger.info('ws authenticated', api.apikey);
    ws.socket._ws.emit('authenticated');
    return result;
  }
  catch(e) {
    switch(e.code) {
      case 1003:
        logger.info('ws unauthorized', api.apikey);
        ws.socket._ws.emit('unauthorized');
        break;
      case 429:
        logger.warn('Retry login', api.apikey, e);
        setTimeout(ws.login,1000,ws,api);
        break;
      default:
        logger.error('login failed', api.apikey, e);
        break;
    }
  };

};

module.exports = {
  marketApi: function(keys) { return new HitbtcSocket(marketUrl, keys); },
  tradingApi: function(keys) { return new HitbtcSocket(tradingUrl, keys); },
  walletApi: function(keys) { return new HitbtcSocket(walletUrl, keys); }
};

HitbtcSocket.prototype.setHandler = function(method, callback) {
  this.socket.setHandler(method, callback);
};

HitbtcSocket.prototype.clearHandler = async function(method) {
  await this.socket.clearHandler(method);
};

HitbtcSocket.prototype.clearHandlers = async function() {
  await this.socket.clearHandlers();
};

HitbtcSocket.prototype.getSubscriptions = async function(channel) { // async
  const result = await this.socket.request('subscriptions',channel, {});
  return result;
};

//
// PUBLIC WebSocket functions
//

HitbtcSocket.prototype.subscribeTrades = async function(options) { // async
  const result = await this.socket.request('subscribe','trades', options);
  return result;
};

HitbtcSocket.prototype.unsubscribeTrades = async function(options) { // async
  const result = await this.socket.request('unsubscribe','trades', options);
  return result;
};

HitbtcSocket.prototype.subscribeCandles = async function(period,options) { // async
  const result = await this.socket.request('subscribe','candles/'+period,options);
  return result;
};

HitbtcSocket.prototype.unsubscribeCandles = async function(period, options) { // async
  const result = await this.socket.request('unsubscribe','candles/'+period,options);
  return result;
};

HitbtcSocket.prototype.subscribePriceRates = async function(speed,options) { // async
  const result = await this.socket.request('subscribe','price/rate/'+speed,options);
  return result;
};

HitbtcSocket.prototype.unsubscribePriceRates = async function(speed,options) { // async
  const result = await this.socket.request('unsubscribe','price/rate/'+speed,options);
  return result;
};

HitbtcSocket.prototype.subscribePriceRatesBatch = async function(speed,options) { // async
  const result = await this.socket.request('subscribe','price/rate/'+speed+'/batch',options);
  return result;
};

HitbtcSocket.prototype.unsubscribePriceRatesBatch = async function(speed,options) { // async
  const result = await this.socket.request('unsubscribe','price/rate/'+speed+'/batch',options);
  return result;
};

HitbtcSocket.prototype.subscribeMiniTicker = async function(speed,options) { // async
  const result = await this.socket.request('subscribe','ticker/price/'+speed,options);
  return result;
};

HitbtcSocket.prototype.unsubscribeMiniTicker = async function(speed,options) { // async
  const result = await this.socket.request('unsubscribe','ticker/price/'+speed,options);
  return result;
};

HitbtcSocket.prototype.subscribeMiniTickerBatch = async function(speed,options) { // async
  const result = await this.socket.request('subscribe','ticker/price/'+speed+'/batch',options);
  return result;
};

HitbtcSocket.prototype.unsubscribeMiniTickerBatch = async function(speed,options) { // async
  const result = await this.socket.request('unsubscribe','ticker/price/'+speed+'/batch',options);
  return result;
};

HitbtcSocket.prototype.subscribeTicker = async function(speed,options) { // async
  const result = await this.socket.request('subscribe','ticker/'+speed,options);
  return result;
};

HitbtcSocket.prototype.unsubscribeTicker = async function(speed,options) { // async
  const result = await this.socket.request('unsubscribe','ticker/'+speed,options);
  return result;
};

HitbtcSocket.prototype.subscribeTickerBatch = async function(speed,options) { // async
  const result = await this.socket.request('subscribe','ticker/'+speed+'/batch',options);
  return result;
};

HitbtcSocket.prototype.unsubscribeTickerBatch = async function(speed,options) { // async
  const result = await this.socket.request('unsubscribe','ticker/'+speed+'/batch',options);
  return result;
};

HitbtcSocket.prototype.subscribeFullOrderbook = async function(options) { // async
  const result = await this.socket.request('subscribe','orderbook/full',options);
  return result;
};

HitbtcSocket.prototype.unsubscribeFullOrderbook = async function(options) { // async
  const result = await this.socket.request('unsubscribe','orderbook/full',options);
  return result;
};

HitbtcSocket.prototype.subscribePartialOrderbook = async function(depth,speed,options) { // async
  const result = await this.socket.request('subscribe','orderbook/'+depth+'/'+speed,options);
  return result;
};

HitbtcSocket.prototype.unsubscribePartialOrderbook = async function(depth,speed,options) { // async
  const result = await this.socket.request('unsubscribe','orderbook/'+depth+'/'+speed,options);
  return result;
};

HitbtcSocket.prototype.subscribePartialOrderbookBatch = async function(depth,speed,options) { // async
  const result = await this.socket.request('subscribe','orderbook/'+depth+'/'+speed+'/batch',options);
  return result;
};

HitbtcSocket.prototype.unsubscribePartialOrderbookBatch = async function(depth,speed,options) { // async
  const result = await this.socket.request('unsubscribe','orderbook/'+depth+'/'+speed+'/batch',options);
  return result;
};

HitbtcSocket.prototype.subscribeTopOrderbook = async function(speed,options) { // async
  const result = await this.socket.request('subscribe','orderbook/top/'+speed,options);
  return result;
};

HitbtcSocket.prototype.unsubscribeTopOrderbook = async function(speed,options) { // async
  const result = await this.socket.request('unsubscribe','orderbook/top/'+speed,options);
  return result;
};

HitbtcSocket.prototype.getTopOrderbookSubscriptions = async function(speed) { // async
  const result = await this.socket.request('subscriptions','orderbook/top/'+speed,{});
  return result;
};


HitbtcSocket.prototype.subscribeTopOrderbookBatch = async function(speed,options) { // async
  const result = await this.socket.request('subscribe','orderbook/top/'+speed+'/batch',options);
  return result;
};

HitbtcSocket.prototype.unsubscribeTopOrderbookBatch = async function(speed,options) { // async
  const result = await this.socket.request('unsubscribe','orderbook/top/'+speed+'/batch',options);
  return result;
};

HitbtcSocket.prototype.getTopOrderbookBatchSubscriptions = async function(speed) { // async
  const result = await this.socket.request('unsubscribe','orderbook/top/'+speed+'/batch',{});
  return result;
};


HitbtcSocket.prototype.subscribeFuturesInformation = async function(options) { // async
  const result = await this.socket.request('subscribe','futures/info',options);
  return result;
};

HitbtcSocket.prototype.unsubscribeFuturesInformation = async function(options) { // async
  const result = await this.socket.request('unsubscribe','futures/info',options);
  return result;
};

HitbtcSocket.prototype.getFuturesInformationSubscriptions = async function() { // async
  const result = await this.socket.request('subscriptions','futures/info',{});
  return result;
};


//
// SPOT TRADING WebSocket functions
//

HitbtcSocket.prototype.subscribeSpotReports = async function() { // async
  const result = await this.socket.request('spot_subscribe', undefined, {});
  return result;
};

HitbtcSocket.prototype.unsubscribeSpotReports = async function() { // async
  const result = await this.socket.request('spot_unsubscribe', undefined, {});
  return result;
};

HitbtcSocket.prototype.getSpotOrders = async function(options) { // async
  const result = await this.socket.request('spot_get_orders', undefined, options);
  return result;
};


HitbtcSocket.prototype.createSpotOrder = async function(options) { // async
  const result = await this.socket.request('spot_new_order', undefined, options);
  return result;
};

HitbtcSocket.prototype.createSpotOrderList = async function(options) { // async
  const result = await this.socket.request('spot_new_order_list', undefined, options);
  return result;
};

HitbtcSocket.prototype.cancelSpotOrder = async function(options) { // async
  const result = await this.socket.request('spot_cancel_order', undefined, options);
  return result;
};

HitbtcSocket.prototype.cancelSpotOrders = async function() { // async
  const result = await this.socket.request('spot_cancel_orders', undefined, {});
  return result;
};

HitbtcSocket.prototype.replaceSpotOrder = async function(options) { // async
  const result = await this.socket.request('spot_replace_order', undefined, options);
  return result;
};

HitbtcSocket.prototype.subscribeSpotBalances = async function(options) { // async
  const result = await this.socket.request('spot_balance_subscribe', undefined, options);
  return result;
};

HitbtcSocket.prototype.unsubscribeSpotBalances = async function(options) { // async
  const result = await this.socket.request('spot_balance_unsubscribe', undefined, options);
  return result;
};

HitbtcSocket.prototype.getSpotBalances = async function() { // async
  const result = await this.socket.request('spot_balances', undefined, {});
  return result;
};

HitbtcSocket.prototype.getSpotBalance = async function(options) { // async
  const result = await this.socket.request('spot_balance', undefined, options);
  return result;
};

HitbtcSocket.prototype.getSpotFees = async function() { // async
  const result = await this.socket.request('spot_fees', undefined, {});
  return result;
};

HitbtcSocket.prototype.getSpotFee = async function(options) { // async
  const result = await this.socket.request('spot_fee', undefined, options);
  return result;
};


//
// MARGIN TRADING WebSocket functions (Trading EndPoint)
//

HitbtcSocket.prototype.subscribeMarginReports = async function() { // async
  const result = await this.socket.request('margin_subscribe', undefined, {});
  return result;
};

HitbtcSocket.prototype.unsubscribeMarginReports = async function() { // async
  const result = await this.socket.request('margin_unsubscribe', undefined, {});
  return result;
};


HitbtcSocket.prototype.getMarginOrders = async function() { // async
  const result = await this.socket.request('margin_get_orders', undefined, {});
  return result;
};

HitbtcSocket.prototype.createMarginOrder = async function(options) { // async
  const result = await this.socket.request('margin_new_order', undefined, options);
  return result;
};

HitbtcSocket.prototype.createMarginOrderList = async function(options) { // async
  const result = await this.socket.request('margin_new_order_list', undefined, options);
  return result;
};

HitbtcSocket.prototype.cancelMarginOrder = async function(options) { // async
  const result = await this.socket.request('margin_cancel_order', undefined, options);
  return result;
};

HitbtcSocket.prototype.replaceMarginOrder = async function(options) { // async
  const result = await this.socket.request('margin_replace_order', undefined, options);
  return result;
};


HitbtcSocket.prototype.getMarginAccounts = async function() { // async
  const result = await this.socket.request('margin_get_accounts', undefined, {});
  return result;
};

HitbtcSocket.prototype.createUpdateMarginAccount = async function(options) { // async
  const result = await this.socket.request('margin_set_account', undefined, options);
  return result;
};


HitbtcSocket.prototype.closeMarginPosition = async function(options) { // async
  const result = await this.socket.request('margin_close_position', undefined, options);
  return result;
};

//
// FUTURES TRADING WebSocket functions (Trading EndPoint)
//

HitbtcSocket.prototype.subscribeFuturesReports = async function() { // async
  const result = await this.socket.request('futures_subscribe', undefined, {});
  return result;
};

HitbtcSocket.prototype.unsubscribeFuturesReports = async function() { // async
  const result = await this.socket.request('futures_unsubscribe', undefined, {});
  return result;
};

HitbtcSocket.prototype.getFuturesOrders = async function() { // async
  const result = await this.socket.request('futures_get_orders', undefined, {});
  return result;
};

HitbtcSocket.prototype.createFuturesOrder = async function(options) { // async
  const result = await this.socket.request('futures_new_order', undefined, options);
  return result;
};

HitbtcSocket.prototype.createFuturesOrderList = async function(options) { // async
  const result = await this.socket.request('futures_new_order_list', undefined, options);
  return result;
};

HitbtcSocket.prototype.replaceFuturesOrder = async function(options) { // async
  const result = await this.socket.request('futures_replace_order', undefined, options);
  return result;
};

HitbtcSocket.prototype.cancelFuturesOrder = async function(options) { // async
  const result = await this.socket.request('futures_cancel_order', undefined, options);
  return result;
};

HitbtcSocket.prototype.getFuturesAccounts = async function() { // async
  const result = await this.socket.request('futures_get_accounts', undefined, {});
  return result;
};

HitbtcSocket.prototype.createUpdateFuturesAccount = async function(options) { // async
  const result = await this.socket.request('futures_set_account', undefined, options);
  return result;
};

HitbtcSocket.prototype.closeFuturesPosition = async function(options) { // async
  const result = await this.socket.request('futures_close_position', undefined, options);
  return result;
};

HitbtcSocket.prototype.subscribeFuturesBalances = async function(options) { // async
  const result = await this.socket.request('futures_balance_subscribe', undefined, {});
  return result;
};

HitbtcSocket.prototype.unsubscribeFuturesBalances = async function(options) { // async
  const result = await this.socket.request('futures_balance_unsubscribe', undefined, {});
  return result;
};

HitbtcSocket.prototype.getFuturesBalance = async function(options={}) { // async
  const result = await this.socket.request('futures_balances', undefined, options);
  return result;
};

HitbtcSocket.prototype.getFuturesFees = async function() { // async
  const result = await this.socket.request('futures_fees', undefined, {});
  return result;
};

HitbtcSocket.prototype.getFuturesFee = async function(options) { // async
  const result = await this.socket.request('futures_fee', undefined, options);
  return result;
};

//
// WALLET WebSocket functions
//

HitbtcSocket.prototype.subscribeTransactions = async function() {
  const result = await this.socket.request('subscribe_transactions', undefined, {});
  return result;
};

HitbtcSocket.prototype.unsubscribeTransactions = async function() {
  const result = await this.socket.request('unsubscribe_transactions', undefined, {});
  return result;
};

HitbtcSocket.prototype.getTransactions = async function(options) {
  const result = await this.socket.request('get_transactions', undefined, options);
  return result;
};

HitbtcSocket.prototype.subscribeWalletBalances = async function() {
  const result = await this.socket.request('subscribe_wallet_balances', undefined, {});
  return result;
};

HitbtcSocket.prototype.unsubscribeWalletBalances = async function() {
  const result = await this.socket.request('unsubscribe_wallet_balances', undefined, {});
  return result;
};

HitbtcSocket.prototype.getWalletBalances = async function(options) {
  const result = await this.socket.request('wallet_balances', undefined, {});
  return result;
};

HitbtcSocket.prototype.getWalletBalance = async function(options) {
  const result = await this.socket.request('wallet_balance', undefined, options);
  return result;
};
