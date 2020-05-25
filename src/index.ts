import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import Pusher from 'pusher';

const app = new Koa();
const router = new Router();
const PORT = 3000;

app.use(json());
app.use(logger());
app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

// Pusher test
const pusher = new Pusher({
  appId: '1007003',
  key: '0e98182319de9dad1ee1',
  secret: 'f794e1377b54ec517c44',
  cluster: 'us3',
  encrypted: true,
});


router.get('/', async (ctx: Koa.Context, next: () => Promise<any>) => {
  ctx.body = { message: 'This is your GET route' };
  pusher.trigger('my-channel', 'my-event', {
    message: 'hello world',
  });
  await next();
});

router.post('/data', async (ctx: Koa.Context, next: () => Promise<any>) => {
  ctx.body = {
    message: 'This is your POST route, attached you can find the data you sent',
    body: ctx.request.body,
  };
  await next();
});

app.listen(PORT, () => console.log('Server started.'));


