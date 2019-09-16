'user strict'
const Sequelize = require('sequelize')
const config = require('../config.json')

const database = new Sequelize(
  config.database.name,
  config.database.username,
  config.database.password, {
    host: config.database.host,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  })

database.Orders = database.import('order.js')

module.exports = database
