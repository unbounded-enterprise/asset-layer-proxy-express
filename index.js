require('dotenv').config(); 

const server = require('uWebSockets.js');
const httpRouter = require('./http-router');
const wsRouter = require('./ws-router');

/* Non-SSL is simply App() vs SSLApp() */
const app = server.App({
  /* There are more SSL options, cut for brevity */
  // key_file_name: 'misc/key.pem',
  // cert_file_name: 'misc/cert.pem',
});

app.get('/*', httpRouter.allHandler);

app.ws('/*', wsRouter.allHandler);

app.listen(9001, (listenSocket) => {
  if (listenSocket) {
    console.log('Listening to port 9001');
  }
});