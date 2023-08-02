import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import { Server } from 'http';
import { AssetLayer } from '@assetlayer/sdk';
import appsRouter from './routes/apps/router';
import assetsRouter from './routes/assets/router';
import collectionsRouter from './routes/collections/router';
import equipsRouter from './routes/equips/router';
import expressionsRouter from './routes/expressions/router';
import listingsRouter from './routes/listings/router';
// import magicRouter from './routes/magic/router';
import slotsRouter from './routes/slots/router';
import usersRouter from './routes/users/router';
import { parseBasicError } from './utils/basic-error';

const validErrorStatusCodes = new Set([400,401,404,406,407,409]);
const app = express();
const port = process.env.PORT || 3001;
const apiRoute = '/api';
let server: Server;

export const assetlayer = new AssetLayer({
  appSecret: process.env.ASSETLAYER_APP_SECRET!,
});

function init() {
  server = app.listen(port, () => console.log(`Running on ${port}`));
  server.keepAliveTimeout = 61 * 1000;
  server.headersTimeout = 65 * 1000;
}
function errorHandler(e: unknown, req: Request, res: Response, next: NextFunction) {
  const error = parseBasicError(e);

  if (validErrorStatusCodes.has(error.status)) return res.status(error.status).send(error.message);
  else return res.status(500).send();
}

app.use(`${apiRoute}/app`, appsRouter);
app.use(`${apiRoute}/asset`, assetsRouter);
app.use(`${apiRoute}/collection`, collectionsRouter);
app.use(`${apiRoute}/equip`, equipsRouter);
app.use(`${apiRoute}/expression`, expressionsRouter);
// app.use(`${apiRoute}/handcash`, handcashRouter);
app.use(`${apiRoute}/listing`, listingsRouter);
// app.use(`${apiRoute}/magic`, magicRouter);
// app.use(`${apiRoute}/permission`, permissionRouter);
app.use(`${apiRoute}/slot`, slotsRouter);
// app.use(`${apiRoute}/stripe`, stripeRouter);
// app.use(`${apiRoute}/team`, teamRouter);
app.use(`${apiRoute}/user`, usersRouter);
app.use('/', async (req: any, res: any, next: NextFunction) => {
  try {
    return res.sendFile('did.html', { root: 'src' });
  }
  catch (e) {
    return next(e);
  }
})

app.use(errorHandler);

/*
const close = () => (
  server
    ? util.promisify(server.close).call(server)
    : Promise.reject(new Error('Server wasn\'t initialized'))
);
*/

export default { app, init, /*close*/ };