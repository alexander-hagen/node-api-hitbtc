const
  dotenv = require("dotenv").config(),
  hitbtc = require("../index.js");

const
  apikey=process.env.MY_API_KEY,
  secret=process.env.MY_API_SECRET,
  privateAPI=new hitbtc.privateApi({ "apikey": apikey, "secret": secret });
  timeout=privateAPI.timeout;

const
  symbol="BTCUSDT",
  quote="USDT",
  base="BTC",
  limit=5,
  depth=5;

// Normal requests

describe('Spot', () => {

  test('Test getSpotBalance() function', async () => {
    expect(stringIsArray(await privateAPI.getSpotBalance())).toBe(true);
  }, timeout);

  test('Test getSpotOrders() function', async () => {
    expect(stringIsArray(await privateAPI.getSpotOrders())).toBe(true);
  }, timeout);

  // HitbtcPrivate.prototype.getSpotOrder
  // HitbtcPrivate.prototype.createSpotOrder
  // HitbtcPrivate.prototype.createSpotOrderList
  // HitbtcPrivate.prototype.replaceSpotOrder
  // HitbtcPrivate.prototype.cancelSpotOrders
  // HitbtcPrivate.prototype.cancelSpotOrder

  test('Test getSpotFee() function', async () => {
    expect(stringIsArray(await privateAPI.getSpotFee())).toBe(true);
  }, timeout);

  test('Test getSpotFee() for symbol function', async () => {
    expect(await privateAPI.getSpotFee(symbol)).toHaveProperty("make_rate");
  }, timeout);

  test('Test getSpotOrderHistory function', async () => {
    expect(stringIsArray(await privateAPI.getSpotOrderHistory())).toBe(true);
  }, timeout);

  test('Test getSpotTradeHistory() function', async () => {
    expect(stringIsArray(await privateAPI.getSpotTradeHistory())).toBe(true);
  }, timeout);

});

describe('Margin', () => {

  test('Test getMarginAccounts() function', async () => {
    expect(stringIsArray(await privateAPI.getMarginAccounts())).toBe(true);
  }, timeout);

  // HitbtcPrivate.prototype.getMarginAccount
  // HitbtcPrivate.prototype.getCrossMarginAccount
  // HitbtcPrivate.prototype.createUpdateMarginAccount
  // HitbtcPrivate.prototype.closeMarginPositions
  // HitbtcPrivate.prototype.closeMarginPosition

  test('Test getMarginOrders() function', async () => {
    expect(stringIsArray(await privateAPI.getMarginOrders())).toBe(true);
  }, timeout);

  // HitbtcPrivate.prototype.getMarginOrder
  // HitbtcPrivate.prototype.createMarginOrder
  // HitbtcPrivate.prototype.createMarginOrderList
  // HitbtcPrivate.prototype.replaceMarginOrder
  // HitbtcPrivate.prototype.cancelMarginOrders
  // HitbtcPrivate.prototype.cancelMarginOrder
  // HitbtcPrivate.prototype.getMarginConfig

  test('Test getMarginOrderHistory() function', async () => {
    expect(stringIsArray(await privateAPI.getMarginOrderHistory())).toBe(true);
  }, timeout);

  test('Test getMarginTradeHistory() function', async () => {
    expect(stringIsArray(await privateAPI.getMarginTradeHistory())).toBe(true);
  }, timeout);

  // HitbtcPrivate.prototype.getMarginPositionsHistory
  // HitbtcPrivate.prototype.getMarginClearingDetails

});

describe('Futures', () => {

  test('Test getFuturesBalance() function', async () => {
    expect(stringIsArray(await privateAPI.getFuturesBalance())).toBe(true);
  }, timeout);

  test('Test getFuturesAccounts() function', async () => {
    expect(stringIsArray(await privateAPI.getFuturesAccounts())).toBe(true);
  }, timeout);

  // HitbtcPrivate.prototype.getFuturesAccount
  // HitbtcPrivate.prototype.getFuturesCrossAccount
  // HitbtcPrivate.prototype.createUpdateFuturesAccount
  // HitbtcPrivate.prototype.closeFuturesPositions
  // HitbtcPrivate.prototype.closeFuturesPosition

  test('Test getFuturesOrders() function', async () => {
    expect(stringIsArray(await privateAPI.getFuturesOrders())).toBe(true);
  }, timeout);

  // HitbtcPrivate.prototype.getFuturesOrder
  // HitbtcPrivate.prototype.createFuturesOrder
  // HitbtcPrivate.prototype.createFuturesOrderList
  // HitbtcPrivate.prototype.replaceFuturesOrder
  // HitbtcPrivate.prototype.cancelFuturesOrders
  // HitbtcPrivate.prototype.cancelFuturesOrder

  test('Test getFuturesConfig() function', async () => {
    expect(await privateAPI.getFuturesConfig()).toHaveProperty("config");
  }, timeout);

  test('Test getFuturesFee() function', async () => {
    expect(stringIsArray(await privateAPI.getFuturesFee())).toBe(true);
  }, timeout);

  // HitbtcPrivate.prototype.getFuturesFee for symbol

  test('Test getFuturesOrderHistory() function', async () => {
    expect(stringIsArray(await privateAPI.getFuturesOrderHistory())).toBe(true);
  }, timeout);

  test('Test getFuturesTradeHistory() function', async () => {
    expect(stringIsArray(await privateAPI.getFuturesTradeHistory())).toBe(true);
  }, timeout);

  // HitbtcPrivate.prototype.getFuturesPositionsHistory
  // HitbtcPrivate.prototype.getFuturesClearingDetails

});

describe('Wallet', () => {

  test('Test getWalletBalance() function', async () => {
    expect(stringIsArray(await privateAPI.getWalletBalance())).toBe(true);
  }, timeout);

  test('Test getDepositAddress() function', async () => {
    const options={ currency: base };
    expect(stringIsArray(await privateAPI.getDepositAddress(options))).toBe(true);
  }, timeout);

  // HitbtcPrivate.prototype.createDepositAddress

  test('Test getRecentDepositAddresses() function', async () => {
    const options={ currency: base };
    expect(stringIsArray(await privateAPI.getRecentDepositAddresses(options))).toBe(true);
  }, timeout);

  test('Test getRecentWithdrawAddresses() function', async () => {
    const options={ currency: base };
    expect(stringIsArray(await privateAPI.getRecentWithdrawAddresses(options))).toBe(true);
  }, timeout);

  // HitbtcPrivate.prototype.withdrawCrypto
  // HitbtcPrivate.prototype.convertCrypto
  // HitbtcPrivate.prototype.withdrawCommit
  // HitbtcPrivate.prototype.withdrawRollback
  // HitbtcPrivate.prototype.transferExchange
  // HitbtcPrivate.prototype.transferInternal

  test('Test getTransactions() function', async () => {
    expect(stringIsArray(await privateAPI.getTransactions())).toBe(true);
  }, timeout);

  // HitbtcPrivate.prototype.getTransaction
  // HitbtcPrivate.prototype.checkOffchainAvailable

  // HitbtcPrivate.prototype.getWithdrawFees

  test('Test getWithdrawFee() function', async () => {
    const options={ currency: base, amount: '1' };
    expect(await privateAPI.getWithdrawFee(options)).toHaveProperty("fee");
  }, timeout);

  // HitbtcPrivate.prototype.getAirDrops
  // HitbtcPrivate.prototype.getAmountLocks

});

describe('Sub-account', () => {

  test('Test getSubaccounts() function', async () => {
    expect(stringIsArray(await privateAPI.getSubaccounts())).toBe(true);
  }, timeout);

  describe('Single Sub-account', () => {

    var account,acl,balance;

    beforeAll(async () => { // initialize socket
      const accounts=await privateAPI.getSubaccounts();
      account=accounts.filter(account => { return account.status=="active"; })[0];
    });

    // HitbtcPrivate.prototype.freezeSubaccount = function(options={}) {
    // HitbtcPrivate.prototype.activateSubaccount = function(options={}) {
    // HitbtcPrivate.prototype.transferFunds = function(options={}) {

    test('Test getACL() function', async () => {
      const options={ sub_account_ids: account.sub_account_id };
      const result=await privateAPI.getACL(options);
      acl=result[0];
      expect(stringIsArray(result)).toBe(true);
    }, timeout);

    // HitbtcPrivate.prototype.changeACL = function(options={}) {

    test('Test getSubaccountBalance() function', async () => {
      const balances=await privateAPI.getSubaccountBalance(account.sub_account_id);
      balance=balances.result.spot[0];
      expect(balances).toHaveProperty("result");
    }, timeout);

    test('Test getSubaccountAddress() function', async () => {
      expect(await privateAPI.getSubaccountAddress(account.sub_account_id,balance.currency)).toHaveProperty("result");
    }, timeout);

  });

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