'use strict';

const http       = require('http');
const https      = require('https');
const path       = require('path');
const express    = require('express');
const expressWs  = require('express-ws');
const bodyParser = require('body-parser');

const getConfig      = require('./getConfig');
const storage        = require('./storage');


const app = createExpressApp();
module.exports = app;


function createExpressApp() {
  const app = express();
  const config = getConfig();
  const server = (config.https ? https : http).createServer(app);

  expressWs(app, server);
  app.use(bodyParser.json());

  app.locals = {
    config,
    storage: storage.createStorage(config.storage),
  };

  app.startServer = () => {
    server.listen(config.port, () => {
      console.log('Listening on %d', config.port);
    });
  };

  app.use('/', require('./web/server'));

  return app;
}