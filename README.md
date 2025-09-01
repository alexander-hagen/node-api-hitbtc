# node-api-hitbtc

![Statements](https://img.shields.io/badge/statements-47.33%25-red.svg?style=flat) ![Branches](https://img.shields.io/badge/branches-24.59%25-red.svg?style=flat) ![Functions](https://img.shields.io/badge/functions-31.98%25-red.svg?style=flat) ![Lines](https://img.shields.io/badge/lines-51.67%25-yellow.svg?style=flat)

Non-official implementation of HitBTC's API's. Developed for personal use.

For support on using the API's or development issues, please refer to the official API documentation. For questions regarding this package, please consult the code first.

## __PUBLIC API__

```javascript
  const hitbtc=require('node-api-hitbtc');

  const publicAPI=new hitbtc.publicApi();

```

### Market Data

| API                    | DESCRIPTION                                           |
| :----                  | :----                                                 |
| getCurrency            | https://api.hitbtc.com/#currencies                    |
| getSymbol              | https://api.hitbtc.com/#symbols                       |
| getTicker              | https://api.hitbtc.com/#tickers                       |
| getPrices              | https://api.hitbtc.com/#prices                        |
| getPricesHistory       | https://api.hitbtc.com/#prices                        |
| getTickerLastPrices    | https://api.hitbtc.com/#prices                        |
| getTrades              | https://api.hitbtc.com/#trades                        |
| getOrderBook           | https://api.hitbtc.com/#order-books                   |
| getCandles             | https://api.hitbtc.com/#candles                       |
| getConvertedCandles    | https://api.hitbtc.com/#candles                       |
| getFuturesInformation  | https://api.hitbtc.com/#futures-info                  |
| getFundingHistory      | https://api.hitbtc.com/#funding-history               |
| getIndexPriceCandles   | https://api.hitbtc.com/#futures-index-price-candles   |
| getMarkPriceCandles    | https://api.hitbtc.com/#futures-mark-price-candles    |
| getPremiumIndexCandles | https://api.hitbtc.com/#futures-premium-index-candles |
| getOpenInterestCandles | https://api.hitbtc.com/#futures-open-interest-candles |

## __PRIVATE API__

```javascript
  const hitbtc=require('node-api-hitbtc');

  const auth = {
    apikey: 'MY_API_KEY',
    secret: 'MY_API_SECRET'
  };

  const privateAPI=new hitbtc.privateApi(auth);

```

### Spot Trading

| API                 | DESCRIPTION                                         |
| :----               | :----                                               |
| getSpotBalance      | https://api.hitbtc.com/#get-spot-trading-balance    |
| getSpotOrders       | https://api.hitbtc.com/#get-all-active-spot-orders  |
| getSpotOrder        | https://api.hitbtc.com/#get-active-spot-order       |
| createSpotOrder     | https://api.hitbtc.com/#create-new-spot-order       |
| createSpotOrderList | https://api.hitbtc.com/#create-new-spot-order-list  |
| replaceSpotOrder    | https://api.hitbtc.com/#replace-spot-order          |
| cancelSpotOrders    | https://api.hitbtc.com/#cancel-all-spot-orders      |
| cancelSpotOrder     | https://api.hitbtc.com/#cancel-spot-order           |
| getSpotFees         | https://api.hitbtc.com/#get-all-trading-commissions |
| getSpotFee          | https://api.hitbtc.com/#get-trading-commission      |

### Spot Trading History

| API                 | DESCRIPTION                                 |
| :----               | :----                                       |
| getSpotOrderHistory | https://api.hitbtc.com/#spot-orders-history |
| getSpotTradeHistory | https://api.hitbtc.com/#spot-trades-history |

### Margin Trading

| API                       | DESCRIPTION                                            |
| :----                     | :----                                                  |
| getMarginAccounts         | https://api.hitbtc.com/#get-all-margin-accounts        |
| getMarginAccount          | https://api.hitbtc.com/#get-isolated-margin-account    |
| getCrossMarginAccount     | https://api.hitbtc.com/#get-cross-margin-account       |
| createUpdateMarginAccount | https://api.hitbtc.com/#create-update-margin-account   |
| closeMarginPositions      | https://api.hitbtc.com/#close-margin-positions         |
| closeMarginPosition       | https://api.hitbtc.com/#close-margin-position          |
| getMarginOrders           | https://api.hitbtc.com/#get-active-margin-orders       |
| getMarginOrder            | https://api.hitbtc.com/#get-active-margin-order        |
| createMarginOrder         | https://api.hitbtc.com/#create-margin-order            |
| createMarginOrderList     | https://api.hitbtc.com/#create-new-margin-order-list   |
| replaceMarginOrder        | https://api.hitbtc.com/#replace-margin-order           |
| cancelMarginOrders        | https://api.hitbtc.com/#cancel-all-margin-orders       |
| cancelMarginOrder         | https://api.hitbtc.com/#cancel-margin-order            |
| getMarginConfig           | https://api.hitbtc.com/#get-margin-position-parameters |

### Margin Trading History

| API                       | DESCRIPTION                                      |
| :----                     | :----                                            |
| getMarginOrderHistory     | https://api.hitbtc.com/#margin-orders-history    |
| getMarginTradeHistory     | https://api.hitbtc.com/#margin-trades-history    |
| getMarginPositionsHistory | https://api.hitbtc.com/#margin-positions-history |
| getMarginClearingDetails  | https://api.hitbtc.com/#margin-clearing-details  |

### Futures Trading

| API                        | DESCRIPTION                                                |
| :----                      | :----                                                      |
| getFuturesBalance          | https://api.hitbtc.com/#get-trading-balance                |
| getFuturesAccounts         | https://api.hitbtc.com/#get-futures-margin-accounts        |
| getFuturesAccount          | https://api.hitbtc.com/#get-futures-margin-account         |
| getFuturesCrossAccount     | https://api.hitbtc.com/#get-futures-cross-margin-account   |
| createUpdateFuturesAccount | https://api.hitbtc.com/#create-update-margin-account-2     |
| closeFuturesPositions      | https://api.hitbtc.com/#close-all-futures-margin-positions |
| closeFuturesPosition       | https://api.hitbtc.com/#close-futures-margin-position      |
| getFuturesOrders           | https://api.hitbtc.com/#get-active-futures-orders          |
| getFuturesOrder            | https://api.hitbtc.com/#get-active-futures-order           |
| createFuturesOrder         | https://api.hitbtc.com/#create-futures-order               |
| createFuturesOrderList     | https://api.hitbtc.com/#create-new-futures-order-list      | 
| replaceFuturesOrder        | https://api.hitbtc.com/#replace-futures-order              |
| cancelFuturesOrders        | https://api.hitbtc.com/#cancel-futures-orders              |
| cancelFuturesOrder         | https://api.hitbtc.com/#cancel-futures-order               |
| getFuturesConfig           | https://api.hitbtc.com/#get-futures-position-parameters    |
| getFuturesFees             | https://api.hitbtc.com/#get-all-trading-commissions-2      |
| getFuturesFee              | https://api.hitbtc.com/#get-trading-commission-2           |

### Futures Trading History

| API                         | DESCRIPTION                                       |
| :----                       | :----                                             |
| getFuturesOrderHistory      | https://api.hitbtc.com/#futures-orders-history    |
| getFuturesTradeHistory      | https://api.hitbtc.com/#futures-trades-history    |
| getFuturesPositionsHistory  | https://api.hitbtc.com/#futures-positions-history |
| getFuturesClearingDetails   | https://api.hitbtc.com/#futures-clearing-details  |

### Wallet Management

| API                        | DESCRIPTION |
| :----                      | :---- |
| getWalletBalance           | https://api.hitbtc.com/#wallet-balance             |
| getDepositAddress          | https://api.hitbtc.com/#get-deposit-crypto-address |
| createDepositAddress       | https://api.hitbtc.com/#generate-deposit-crypto-address |
| getRecentDepositAddresses  | https://api.hitbtc.com/#last-10-deposit-crypto-addresses |
| getRecentWithdrawAddresses | https://api.hitbtc.com/#last-10-withdrawal-crypto-addresses |
| withdrawCrypto             | https://api.hitbtc.com/#withdraw-crypto |
| convertCrypto              | https://api.hitbtc.com/#convert-between-currencies |
| withdrawCommit             | https://api.hitbtc.com/#withdraw-crypto-commit-or-rollback |
| withdrawRollback           | https://api.hitbtc.com/#withdraw-crypto-commit-or-rollback |
| checkMine                  | https://api.hitbtc.com/#check-if-crypto-address-belongs-to-current-account |
| transferExchange           | https://api.hitbtc.com/#transfer-between-wallet-and-exchange |
| transferInternal           | https://api.hitbtc.com/#transfer-money-to-another-user |
| getTransactions            | https://api.hitbtc.com/#get-transactions-history |
| getTransaction             | https://api.hitbtc.com/#get-transactions-history |
| checkOffchainAvailable     | https://api.hitbtc.com/#check-if-offchain-is-available |
| getWithdrawFees            | https://api.hitbtc.com/#estimate-withdrawal-fees |
| getWithdrawFee             | https://api.hitbtc.com/#estimate-withdrawal-fee  |
| getAirdrops                | https://api.hitbtc.com/#airdrops |
| getAmountLocks             | https://api.hitbtc.com/#get-amount-locks |

### Sub-accounts

| API                  | DESCRIPTION                                            |
| :----                | :----                                                  |
| getSubaccounts       | https://api.hitbtc.com/#sub-accounts                   |
| freezeSubaccount     | https://api.hitbtc.com/#freeze-sub-account             |
| activateSubaccount   | https://api.hitbtc.com/#activate-sub-account           |
| transferFunds        | https://api.hitbtc.com/#transfer-funds                 |
| getACL               | https://api.hitbtc.com/#get-acl-settings               |
| changeACL            | https://api.hitbtc.com/#change-acl-settings            |
| getSubaccountBalance | https://api.hitbtc.com/#get-sub-account-balance        |
| getSubaccountAddress | https://api.hitbtc.com/#get-sub-account-crypto-address |

## __WEBSOCKET API__

```javascript
  const hitbtc=require('node-api-hitbtc');

  const auth = {
    apikey: 'MY_API_KEY',
    secret: 'MY_API_SECRET'
  };

  const marketAPI=new hitbtc.sockets.marketApi();
  marketAPI.socket._ws.on('initialized', async () => {
    // do your own initialization
  });

  const tradingAPI=new hitbtc.sockets.tradingApi(auth);
  tradingAPI.setHandler('orders', (symbol,method,data,option) => { updateOrder(symbol,method,data); });

  tradingAPI.socket._ws.on('authenticated', async () => {
    const res=await tradingAPI.subscribeOrderUpdates();
  });

  tradingAPI.socket._ws.on('closed', async () => {
    // do something, like clean-up and reconnect
  });

  function updateOrder(symbol,method,data) {
    // do something
  };

```

### Socket Market Data

| API                                                             | HANDLER                             | DESCRIPTION |
| :----                                                           | :----                               | :---- |
| subscribeTrades unsubscribeTrades                               | trades_snapshot trades_update       | |
| subscribeCandles unsubscribeCandles                             | candles_snapshot candles_update     | |
| subscribePriceRates unsubscribePriceRates                       | price                               | | 
| subscribePriceRatesBatch unsubscribePriceRatesBatch             | price_batch                         | |
| subscribeMiniTicker unsubscribeMiniTicker                       | ticker_price                        | |
| subscribeMiniTickerBatch unsubscribeMiniTickerBatch             | ticker_price_batch                  | |
| subscribeTicker unsubscribeTicker                               | ticker                              | |
| subscribeTickerBatch unsubscribeTickerBatch                     | ticker_batch                        | |
| subscribeFullOrderbook unsubscribeFullOrderbook                 | orderbook_snapshot orderbook_update | |
| subscribePartialOrderbook unsubscribePartialOrderbook           | orderbook                           | |
| subscribePartialOrderbookBatch unsubscribePartialOrderbookBatch | orderbook_batch                     | |
| subscribeTopOrderbook unsubscribeTopOrderbook                   | orderbook_top                       | |
| subscribeTopOrderbookBatch unsubscribeTopOrderbookBatch         | orderbook_top_batch                 | |
| subscribeFuturesInformation unsubscribeFuturesInformation       | futures                             | |

### Socket Authentication

| API              | DESCRIPTION                                      |
| :----            | :----                                            |
| login            | https://api.hitbtc.com/#socket-authentication    |
| getSubscriptions | https://api.hitbtc.com/#get-active-subscriptions |
| setHandler       |                                                  |
| clearHandler     |                                                  |
| clearHandlers    |                                                  |

### Socket Spot Trading

| API                                           | HANDLER      | DESCRIPTION                                        |
| :----                                         | :----        | :----                                              |
| subscribeSpotReports unsubscribeSpotReports   | spot_orders  | https://api.hitbtc.com/#subscribe-to-reports       |
| subscribeSpotBalances unsubscribeSpotBalances | spot_balance | https://api.hitbtc.com/#subscribe-to-spot-balances |

| API                 | DESCRIPTION                                          |
| :----               | :----                                                |
| getSpotOrders       | https://api.hitbtc.com/#get-active-spot-orders       |
| createSpotOrder     | https://api.hitbtc.com/#place-new-spot-order         |
| createSpotOrderList | https://api.hitbtc.com/#create-new-spot-order-list-2 |
| cancelSpotOrder     | https://api.hitbtc.com/#cancel-spot-order-2          |
| cancelSpotOrders    | https://api.hitbtc.com/#cancel-replace-spot-order    |
| replaceSpotOrder    | https://api.hitbtc.com/#cancel-spot-orders           |
| getSpotBalances     | https://api.hitbtc.com/#get-spot-trading-balances    |
| getSpotBalance      | https://api.hitbtc.com/#get-spot-trading-balance-2   |
| getSpotFees         | https://api.hitbtc.com/#get-spot-fees                |
| getSpotFee          | https://api.hitbtc.com/#get-spot-fee                 |

### Socket Margin Trading

| API                                             | HANDLER       | DESCRIPTION                                    |
| :----                                           | :----         | :----                                          |
| subscribeMarginReports unsubscribeMarginReports | margin_orders | https://api.hitbtc.com/#subscribe-to-reports-2 |

| API                       | DESCRIPTION                                            |
| :----                     | :----                                                  |
| getMarginOrders           | https://api.hitbtc.com/#get-margin-orders              |
| createMarginOrder         | https://api.hitbtc.com/#place-new-margin-order         |
| createMarginOrderList     | https://api.hitbtc.com/#create-new-margin-order-list-2 |
| cancelMarginOrder         | https://api.hitbtc.com/#cancel-margin-order-2          |
| replaceMarginOrder        | https://api.hitbtc.com/#cancel-replace-margin-order    |
| getMarginAccounts         | https://api.hitbtc.com/#get-margin-accounts            |
| createUpdateMarginAccount | https://api.hitbtc.com/#create-update-margin-account-3 |
| closeMarginPosition       | https://api.hitbtc.com/#close-margin-position-2        |

### Socket Futures Trading

| API                                                 | HANDLER         | DESCRIPTION                                           |
| :----                                               | :----           | :----                                                 |
| subscribeFuturesReports unsubscribeFuturesReports   | futures_orders  | https://api.hitbtc.com/#subscribe-to-reports-3        |
| subscribeFuturesBalances unsubscribeFuturesBalances | futures_balance | https://api.hitbtc.com/#subscribe-to-futures-balances |

| API                        | DESCRIPTION                                             |
| :----                      | :----                                                   |
| getFuturesOrders           | https://api.hitbtc.com/#get-active-futures-orders-2     |
| createFuturesOrder         | https://api.hitbtc.com/#place-new-futures-order         |
| createFuturesOrderList     | https://api.hitbtc.com/#create-new-futures-order-list-2 |
| replaceFuturesOrder        | https://api.hitbtc.com/#cancel-futures-order-2          |
| cancelFuturesOrder         | https://api.hitbtc.com/#cancel-replace-a-futures-order  |
| getFuturesAccounts         | https://api.hitbtc.com/#get-futures-accounts            |
| createUpdateFuturesAccount | https://api.hitbtc.com/#create-update-futures-account   |
| closeFuturesPosition       | https://api.hitbtc.com/#close-futures-position          |
| getFuturesBalance          | https://api.hitbtc.com/#get-futures-trading-balances https://api.hitbtc.com/#get-futures-trading-balance |
| getFuturesFees             | https://api.hitbtc.com/#get-futures-fees                |
| getFuturesFee              | https://api.hitbtc.com/#get-futures-fee                 |

### Socket Wallet Management

| API                                               | HANDLER            | DESCRIPTION                                          |
| :----                                             | :----              | :----                                                |
| subscribeTransactions unsubscribeTransactions     | transaction_update | https://api.hitbtc.com/#subscribe-to-transactions    |
| subscribeWalletBalances unsubscribeWalletBalances | wallet_balances    | https://api.hitbtc.com/#subscribe-to-wallet-balances |

| API               | DESCRIPTION                                    |
| :----             | :----                                          |
| getTransactions   | https://api.hitbtc.com/#get-transactions       |
| getWalletBalances | https://api.hitbtc.com/#request-wallet-balance |
| getWalletBalance  | https://api.hitbtc.com/#request-wallet-balance |
