'use strict'

module.exports = (app) => {
  var orders = require('../controllers/orderController')

  app.route('/orders')
    .post(orders.placeOrder)
  app.route('/list')
    .get(orders.list)
}
