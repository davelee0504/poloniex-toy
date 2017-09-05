import Koa from 'koa';

const app = new Koa()
  .use(ctx => {
    ctx.body = 'Hello Koa';
  });

export default app;