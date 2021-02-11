import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as compose from 'koa-compose';
import * as cors from 'kcors';

const errorHandler = async (ctx: Koa.Context, next: Function) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
  }
};

export const middleware = compose([
  errorHandler,
  bodyParser(),
  cors({
    credentials: true,
    exposeHeaders: ['Access-Token', 'Cookie'],
  }),
]);
