'use strict';

const log = require('./log');

function initRoutes(app, server) {
  log.init();

  app.get('/', async (req, res) => {
    res.send(`
      <pre>${JSON.stringify(await log.read(), null, 2)}</pre>
    `);
  });

  app.post('/log', async (req, res) => {
    const { body } = req;

    if (body && body.client) {
      body.client.ip = req.headers['x-forwarded-for']
        || req.connection.remoteAddress;
    }

    const result = await log.write(req.body);
    if (result === true) {
      res.status(200);
      res.send('ok');
    } else {
      res.status(500);
      res.send({ message: result });
    }
  });
}

module.exports = initRoutes;