'use strict';

const Storage = require('./Storage');

class Memory extends Storage {
  constructor(options) {
    super(options);
    this.data = [];
  }

  async count() {
    return this.data.length;
  }

  async clear() {
    this.data = [];
    this.emit('clear', this);
  }

  async read(limit = 100, offset = 0) {
    const begin = Math.max(this.data.length - limit - offset, 0);
    return this.data.slice(begin, begin + limit);
  }

  async write(data) {
    data.id = this.data.length;
    this.data.push(data);
    this.emit('write', data, this);
  }
}

module.exports = Memory;