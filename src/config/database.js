/**
 * @namespace Config
 * @property {module:DatabaseConfig} DatabaseConfig
 */

/**
 * Configuration Database Module
 * Change this configs to setup the connection
 * @module DatabaseConfig
 */
export default {
  dev: {
    local:{
      host: 'localhost',
      port: '27017',
      database: 'conte-um-conto'
    }
  },
  production: {
    conections: [{
      provider: 'heroku'
    }]
  }
}