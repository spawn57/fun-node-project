'use strict'

module.exports = (app) => {
  var orders = require('../controllers/orderController')

  app.route('/orders')
    .post(orders.placeOrder)
  app.route('/orders/:id')
    .patch(orders.takeOrder)
  app.route('/list')
    .get(orders.list)
}
