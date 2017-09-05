import Koa from 'koa';
import api from './api';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';


import Poloniex from 'poloniex.js';

const poloniex = new Poloniex();

const app = new Koa()
  .use(cors())
  .use(bodyParser())
  .use(async (ctx, next) => {
    ctx.body = 'Hello Koa';
    await next();
  })
  .use(api.routes())
  .use(api.allowedMethods());

export default app;