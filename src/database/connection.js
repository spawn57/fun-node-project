'user strict'
var Sequelize = require('sequelize')

const database = new Sequelize('webapp', 'order_user', 'order_user_baby', {
  host: '172.19.0.2',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
})

database.Orders = database.import('order.js')

module.exports = database
