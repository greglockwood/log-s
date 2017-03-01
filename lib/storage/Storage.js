'use strict';

const EventEmitter = require('events').EventEmitter;

/**
 * @property {Object} options
 */
class Storage extends EventEmitter {
  constructor(options) {
    super();
    this.options = options || {};
  }

  get paused() {
    return !!this.options.paused;
  }

  set paused(value) {
    value = !!value;
    this.options.paused = value;
    this.emit('pause', value, this);
  }

  async clear() {
    throw new Error('not implemented');
  }

  get count() {
    throw new Error('not implemented');
  }

  async read(limit = 100, offset = 0) {
    throw new Error('not implemented');
  }

  async write(data) {
    throw new Error('not implemented');
  }
}

module.exports = Storage;