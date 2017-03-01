'use strict';

const Memory = require('./Memory');

module.exports = {
  createStorage,
};

const storageNames = {
  memory: './Memory',
};

/**
 * @param {Object} config
 * @param {string} config.name
 * @returns {Storage}
 */
function createStorage(config) {
  if (!config.name) {
    throw new Error('Can\'t read a storage.name option')
  }
  const storagePackage = storageNames[config.name] || config.name;
  const Storage = require(storagePackage);
  return new Storage(config);
}