import KoaRouter from 'koa-router';
import Poloniex from 'poloniex-api-node';

const PRECISION_DIGIT = 4;
const poloniex = new Poloniex();
const CustomTicker = require('./customTicker.js');
let customTicker = new CustomTicker();
const api = KoaRouter();

api.get('/hello/:name',
  async (ctx, next) => {
    const {
      name
    } = ctx.params;

    ctx.body = {
      hello: name,
    };
  });

api.get('/poloniex',
  async (ctx, next) => {
    let data = await poloniex.returnTicker()

    ctx.body = {
      data: data
    };
  });


 api.get('/bmpredict', async(ctx, next) => {
  let audResult = await customTicker.getAUDTicker()
  let usdResult = await customTicker.getUSDTicker()
  let audXUsd = await customTicker.getExchangeRate()
  let historyTickers = await customTicker.getHistoryTrend()
  
  let btcMarket = audResult.AUD;
  let poloniex = usdResult.USD * audXUsd.rates.AUD;
  let valueDiff = (((btcMarket-poloniex) / btcMarket)).toPrecision(PRECISION_DIGIT);
  let historyValueDiff = historyDataProcess(historyTickers);

  ctx.body = {
    percentageChange: historyValueDiff,
    poloniex: poloniex,
    btcMarket: btcMarket,
    valueDiff: valueDiff
  };


  function historyDataProcess(history){
    let from = history.Data[0];
    let end = history.Data[history.Data.length -1];
    let valueDiff = ((end.close-from.close)/100);
    return valueDiff;
  }


 });

export default api;