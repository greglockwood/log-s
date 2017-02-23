'use strict';

const express    = require('express');
const bodyParser = require('body-parser');
const http       = require('http');
const https      = require('https');
const WebSocket  = require('ws');

const initRoutes = require('./initRoutes');

class Server {
  constructor(options) {
    this.options = Object.assign({
      https: false,
      port: 8085,
    }, options);
  }

  connect() {
    const transport = this.options.https ? https : http;

    this.app = express();
    this.app.use(bodyParser.json());

    initRoutes(this.app, this);

    this.server = transport.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });

    this.wss.on('connection', (ws) => {
      ws.on('message', function incoming(message) {
        console.log('received: %s', message);
      });

      ws.send('something');
    });

    this.server.listen(this.options.port, () => {
      console.log('Listening on %d', this.server.address().port);
    });
  }
}

module.exports = Server;