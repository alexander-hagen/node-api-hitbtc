const
  dotenv = require("dotenv").config(),
  hitbtc = require("../index.js");

const
  apikey=process.env.MY_API_KEY,
  secret=process.env.MY_API_SECRET;

const
  symbol="BTCUSDC",
  invalid_symbol="!@#$%^&*",
  limit=5,
  depth=5;

const timeout=5000;

// Get sockets

//var accountAPI;
//var timers={};

describe('Market', () => {

});

describe('Spot', () => {

  var tradingAPI;

  beforeAll(async () => { // initialize socket
    tradingAPI=new hitbtc.sockets.tradingApi({ "apikey": apikey, "secret": secret });
    await waitForConnection(tradingAPI);
//    await tradingAPI.setHandler('market.simple.depth.step0', (method,data,symbol,stamp) => { eventHandler(method); });
    return;
  });

  test('Test getSpotBalances() function', async () => {
    expect(stringIsArray(await tradingAPI.getSpotBalances())).toBe(true);
  }, timeout);

  afterAll(async () => { // clean-up socket
//    tradingAPI.socket.terminate();
  });

});

describe('Margin', () => {

});

describe('Futures', () => {

});

describe('Wallet', () => {

});

// Error testing

// Helper functions

function stringIsJSON(str) {
  try { 
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

function stringIsArray(str) {
  try { 
    return Array.isArray(str);
  } catch {
    return false;
  }
};

function objectIsJSON(obj) {
  try { 
    JSON.parse(JSON.stringify(obj));
    return true;
  } catch {
    return false;
  }
};

function checkError(obj,code,reason) {
  if(obj.code==code && obj.reason==reason) { return true; }
  return false;
};

function waitForConnection(websocket) {
  var socketResolve,socketReject;
  var done=false;
  var timer=setTimeout( () => { if(!done) { socketReject(done); }; }, timeout);

  websocket.socket._ws.on('authenticated', async () => { // Wait for websocket to authenticate.
    console.log('authenticated');
    done=true;clearTimeout(timer);socketResolve(done);
  });

  websocket.socket._ws.on('initialized', async () => { // Wait for websocket to initialize.
    console.log('initialized');
    done=true;clearTimeout(timer);socketResolve(done);
  });

  var promise=new Promise(function(resolve, reject) { socketResolve=resolve; socketReject=reject; });

  return promise;
};

var _promises = new Map();

function eventHandler(key) {
  console.log("Received event ",key);
  if (_promises.has(key)) {
    clearTimeout(timers[key]);
    const cb = _promises.get(key);
    _promises.delete(key);
    cb.resolve({code:"200", data: key});
  };
};

function waitForPromise(key) {
  var promise=new Promise((resolve, reject) => {
    _promises.set(key, {resolve, reject});
    timers[key]=setTimeout(() => {
      if (_promises.has(key)) {
        _promises.delete(key);
        reject({"code":"408", "data": key});
      };
    }, timeout-1000);
  });
  return promise;
};
