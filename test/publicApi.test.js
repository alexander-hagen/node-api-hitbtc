const
  hitbtc = require("../index.js");

const
  publicAPI=new hitbtc.publicApi(),
  timeout=publicAPI.timeout;

const
  symbol="BTCUSDT",
  future="BTCUSDT_PERP",
  quote="USDT",
  base="BTC",
  limit=5,
  depth=5;

// Normal requests

test('Test getCurrency() function', async () => {
  expect(await publicAPI.getCurrency()).toHaveProperty(base);
}, timeout);

test('Test getSymbol() function', async () => {
  expect(await publicAPI.getSymbol()).toHaveProperty(symbol);
}, timeout);

test('Test getTicker() function', async () => {
  expect(await publicAPI.getTicker()).toHaveProperty(symbol);
}, timeout);

test('Test getPrices() function', async () => {
  const options={ from: base, to: quote };
  expect(await publicAPI.getPrices(options)).toHaveProperty(base);
}, timeout);

test('Test getPricesHistory() function', async () => {
  const options={ from: base, to: quote };
  expect(await publicAPI.getPricesHistory(options)).toHaveProperty(base);
}, timeout);

test('Test getTickerLastPrices() function', async () => {
  expect(await publicAPI.getTickerLastPrices()).toHaveProperty(symbol);
}, timeout);

test('Test getTrades() function', async () => {
  expect(await publicAPI.getTrades()).toHaveProperty(symbol);
}, timeout);

test('Test getOrderBook() function', async () => {
  const options={ depth: 1};
  expect(await publicAPI.getOrderBook(undefined,options)).toHaveProperty(symbol);
}, timeout);

test('Test getCandles() function', async () => {
  const options={ limit: 1};
  expect(await publicAPI.getCandles(undefined,options)).toHaveProperty(symbol);
}, timeout);

test('Test getConvertedCandles() function', async () => {
  const options={ limit: 1, target_currency: quote };
  expect(await publicAPI.getConvertedCandles(undefined,options)).toHaveProperty("target_currency",quote);
}, timeout);

test('Test getFuturesInformation function', async () => {
  expect(await publicAPI.getFuturesInformation()).toHaveProperty(future);
}, timeout);

test('Test getFundingHistory function', async () => {
  expect(await publicAPI.getFundingHistory()).toHaveProperty(future);
}, timeout);

test('Test getIndexPriceCandles() function', async () => {
  const options={ limit: 1};
  expect(await publicAPI.getIndexPriceCandles(options)).toHaveProperty(future);
}, timeout);

test('Test getMarkPriceCandles() function', async () => {
  const options={ limit: 1};
  expect(await publicAPI.getMarkPriceCandles(options)).toHaveProperty(future);
}, timeout);

test('Test getPremiumIndexCandles() function', async () => {
  const options={ limit: 1};
  expect(await publicAPI.getPremiumIndexCandles(options)).toHaveProperty(future);
}, timeout);

test('Test getOpenInterestCandles() function', async () => {
  const options={ limit: 1};
  expect(await publicAPI.getOpenInterestCandles(options)).toHaveProperty(future);
}, timeout);

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