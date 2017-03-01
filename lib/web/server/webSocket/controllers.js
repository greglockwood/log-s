class Callback {
  constructor(data, socket) {
    this.data = data;
    this.socket = socket;
  }

  reply(data) {
    data = Object.assign(data, { callId: this.data.callId });

    this.socket.send(JSON.stringify(data));
  }
}

module.exports = {
  Callback,

  async load(data, helper, callback) {
    const storage = helper.storage;
    console.log(await storage.read(data.limit, data.offset));
    callback.reply({
      data: await storage.read(data.limit, data.offset),
      count: storage.count(),
      paused: storage.paused
    });
  },

  async clear(data, helper, callback) {
    const storage = helper.storage;
    await storage.clear();
    callback.reply({ result: true });
  },

  async togglePause(data, helper, callback) {
    const storage = helper.storage;
    storage.paused = !storage.paused;
    callback.reply({ paused: storage.paused });
  },

  onStorage: {
    async write(data, storage, send) {
      send('write', {
        data: data,
        count: await storage.count(),
      });
    },

    async clear(storage, send) {
      send('clear');
    },

    async pause(state, storage, send) {
      send('pause', { state });
    }
  }
};