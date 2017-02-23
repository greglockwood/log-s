'use strict';

const Memory = require('./transport/Memory');

module.exports = {
  init,
  read,
  write
};

let transports = [];

function read(limit = 100) {
  if (transports.length < 1) {
    return [];
  }

  return transports[0].read(limit);
}

function write(data) {
  transports.forEach(t => t.write(data));
  return true;
}

function init() {
  transports = [
    new Memory()
  ];
}