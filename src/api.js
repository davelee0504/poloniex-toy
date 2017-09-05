import KoaRouter from 'koa-router';

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

export default api;