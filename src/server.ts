import 'dotenv/config';
import express from 'express';
import { Server } from 'http';
import { AssetLayer } from '@assetlayer/sdk';
import appsRouter from './routes/apps/router';
import assetsRouter from './routes/assets/router';
import collectionsRouter from './routes/collections/router';
import expressionsRouter from './routes/expressions/router';
import listingsRouter from './routes/listings/router';
import slotsRouter from './routes/slots/router';
import usersRouter from './routes/users/router';

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

app.use(`${apiRoute}/app`, appsRouter);
app.use(`${apiRoute}/asset`, assetsRouter);
app.use(`${apiRoute}/collection`, collectionsRouter);
// app.use(`${apiRoute}/equip`, equipRouter);
app.use(`${apiRoute}/expression`, expressionsRouter);
// app.use(`${apiRoute}/handcash`, handcashRouter);
app.use(`${apiRoute}/listing`, listingsRouter);
// app.use(`${apiRoute}/permission`, permissionRouter);
app.use(`${apiRoute}/slot`, slotsRouter);
// app.use(`${apiRoute}/stripe`, stripeRouter);
// app.use(`${apiRoute}/team`, teamRouter);
app.use(`${apiRoute}/user`, usersRouter);

// app.use(errorHandler);

/*
const close = () => (
  server
    ? util.promisify(server.close).call(server)
    : Promise.reject(new Error('Server wasn\'t initialized'))
);
*/

export default { app, init, /*close*/ };