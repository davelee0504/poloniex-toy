import Koa from 'koa';
import Poloniex from 'poloniex.js';


const poloniex = new Poloniex();



const app = new Koa()
  .use(ctx => {
    ctx.body = 'Hello Koa';
  });

export default app;