const controllers = require('./controllers');

/**
 * @property {Array} sockets
 * @property {Object} request
 */
class Helper {
  constructor() {
    this.sockets = [];
  }

  addClient(socket, req) {
    socket.on('message', (text) => {
      this.onMessage(text, socket);
    });

    if (!this.request && req) {
      this.attachStorageHandlers(req);
    }

    this.sockets.push(socket);
    this.request = req;
  }

  onMessage(text, ws) {
    const data = JSON.parse(text);
    const method = data.method;

    if (method && controllers[method]) {
      controllers[method](data, this, new controllers.Callback(data, ws));
    }
  }

  attachStorageHandlers(req) {
    const storage = req.app.locals.storage;
    const onStorage = controllers.onStorage;

    storage.on('clear', () => {
      this.sockets.forEach(ws => onStorage.clear(storage, makeSend(ws)));
    });

    storage.on('pause', (state) => {
      this.sockets.forEach(ws => onStorage.pause(state, storage, makeSend(ws)));
    });

    storage.on('write', (data) => {
      this.sockets.forEach(ws => onStorage.write(data, storage, makeSend(ws)));
    });

    function makeSend(ws) {
      return function(method, data) {
        Object.assign(data, { method });
        ws.send(JSON.stringify(data));
      }
    }
  }

  get storage() {
    return this.request.app.locals.storage;
  }
}


module.exports = new Helper();