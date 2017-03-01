import { EventEmitter } from 'events';

const CONNECTION_TIMEOUT = 7000;
const RECONNECT_TIMEOUT  = 2000;

class Socket extends EventEmitter {
  constructor(url) {
    super();

    this.url = url || location.href.replace(/^http/, 'ws');
    this.calls = {};

    this.connect         = ::this.connect;
    this.checkConnection = ::this.checkConnection;

    this.connect();
    this.checkConnectionInterval = setInterval(
      this.checkConnection,
      RECONNECT_TIMEOUT
    );
  }

  connect() {
    this.socket = new WebSocket(this.url);
    this.socket.onmessage = ::this.onMessage;
    this.socket.onerror   = ::this.onError;
    this.socket.onclose   = ::this.onClose;
  }

  async resolveWhenConnected() {
    const socket = this.socket;
    switch (socket.readyState) {
      case WebSocket.OPEN: {
        return this;
      }

      case WebSocket.CONNECTING: {
        return new Promise((resolve, reject) => {
          setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              resolve(this);
            }
            if (socket.readyState === WebSocket.CLOSED) {
              reject('Couldn\'t connect to WebSocket (timeout)');
            }
          }, 100);
        });
      }

      default: {
        console.log('State', socket.readyState);
        throw new Error('Couldn\'t connect to WebSocket');
      }
    }
  }

  checkConnection() {
    if (!this.checkConnectionInterval) return;
    if (this.state !== WebSocket.CLOSED) return;

    setTimeout(this.connect, 1000);
  }

  on(event, listener, context = null) {
    return this.addListener(event, listener, context);
  }

  async call(method, data) {
    return new Promise((resolve, reject) => {
      let isResolved = false;
      const callId = Math.random().toString(36).substring(2);
      this.calls[callId] = resolve;
      this.send({ method, data, callId });
      setTimeout(() => {
        if (isResolved) return;
        delete this.calls[callId];
        reject(`Error Calling ${method}: Timeout`);
      }, CONNECTION_TIMEOUT);
    });
  }

  send(data) {
    this.socket.send(JSON.stringify(data));
  }

  onMessage(event) {
    let message;
    try {
      message = JSON.parse(event.data);
    } catch (e) {
      this.emit('error', e);
      return;
    }

    if (message.callId) {
      const callId = message.callId;
      const handler = this.calls[callId];
      delete this.calls[callId];

      if (!handler) {
        const error = new Error(`Unmatched call received from server`);
        this.emit('error', error);
        return;
      }

      handler(message);
      return;
    }

    if (message.method) {
      this.emit(message.method, message);
    }
  }

  onError(event) {
    console.log(event);
    this.emit('error', event);
  }

  onClose(event) {
    console.log(event);
    this.emit('close', event);
  }
}

export default new Socket();