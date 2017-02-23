'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');

class File {
  constructor(options) {
    if (!this.options.path) {
      this.options.path = '/tmp/logging-server';
    }

    this.options = options;

    this.streams = {};
  }

  async write(data) {
    if (!data) {
      return;
    }

    if (!data.client) {
      data.client = {};
    }

    const stream = this.getFileStream(data);
    stream.write(JSON.stringify(data) + ',');
  }

  /**
   * @param {Object} data
   * @returns fs.WriteStream
   */
  async getFileStream(data) {
    const streamKey = data.client.name || 'default';
    if (this.streams[streamKey]) {
      return this.streams[streamKey];
    }

    const path = this.options.path || '/tmp/logger';
    await makeDirRecursively(path);

    this.streams[streamKey] = fs.createWriteStream(path,  { 'flags': 'a' });
    return this.streams[streamKey];
  }
}

function makeDirRecursively(path) {
  return new Promise(async (resolve, reject) => {
    mkdirp(path, (err) => {
      err ? reject(err) : resolve();
    });
  });
}

module.exports = File;