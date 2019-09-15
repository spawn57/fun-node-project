'use strict'

const logger = require('../services/logService')

logger.info('setting up order routes')
module.exports = (app) => {
  var orders = require('../controllers/orderController')
  app.route('/orders')
    .post(orders.placeOrder)
    .get(orders.list)
  app.route('/orders/:id')
    .patch(orders.takeOrder)
}
