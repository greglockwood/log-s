'use strict';

module.exports = getConfig;

/**
 * @property {number} port
 * @property {boolean} https
 * @property {Object} storage
 */
class Config {
  constructor() {
    this.port = 8085;
    this.https = false;
    this.storage = {
      name: 'memory'
    };
  }
}

/**
 * @returns Config
 */
function getConfig() {
  return new Config();
}