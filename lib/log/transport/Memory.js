'use strict';

class Memory {
  constructor() {
    this.data = [];
  }

  async write(data) {
    this.data.push(data);
  }

  async read(limit = 100) {
    return this.data.slice(-limit);
  }
}

module.exports = Memory;