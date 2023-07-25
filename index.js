require('dotenv').config(); 

const express = require('express')
const app = express();
const port = process.env.PORT || 3001;
const httpRouter = require('./http-router');

app.get('/*', httpRouter.allHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})