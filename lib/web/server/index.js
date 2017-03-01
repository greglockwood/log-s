'use strict';

const path    = require('path');
const express = require('express');
const router  = express.Router();

const webSocket = require('./webSocket');

module.exports = router;

router.use(express.static(path.join(__dirname, '..', 'public')));

router.get('/', async (req, res) => {
  const { storage } = req.app.locals;
  res.send(`
      <pre>${JSON.stringify(await storage.read(), null, 2)}</pre>
    `);
});

router.post('/log', async (req, res) => {
  const { storage } = req.app.locals;
  const { body } = req;

  if (body && body.client) {
    body.client.ip = req.headers['x-forwarded-for']
      || req.connection.remoteAddress;
  }

  if (body && !body.date) {
    body.date = new Date().getTime();
  }

  if (storage.paused) {
    res.status(202);
    res.send('paused');
    return;
  }

  const result = await storage.write(body);
  if (result === true) {
    res.status(200);
    res.send('ok');
    return;
  }

  res.status(500);
  res.send({ message: result });
});

router.ws('/', (ws, req) => {
  webSocket.addClient(ws, req);
});