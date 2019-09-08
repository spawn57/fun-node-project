'use strict'
var sql = require('../db')

var OrderService = {}

OrderService.addOrder = (order, result) => {
  // sql.query('SELECT * FROM orders', function(error, response))
  console.log('added order... not really')
  result(null, order.uuid)
}

OrderService.findAll = function (result) {
  sql.query('SELECT * FROM orders', (error, response) => {
    if (error) {
      console.log('error: ', error)
      result(null, error)
    } else {
      console.log('order: ', response)
      result(null, response)
    }
  })
}

module.exports = OrderService
