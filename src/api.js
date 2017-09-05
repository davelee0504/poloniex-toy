import KoaRouter from 'koa-router';
import Poloniex from 'poloniex-api-node';

const poloniex = new Poloniex();
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

export default api;