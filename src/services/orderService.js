'use strict'
const database = require('../database/connection')
const Order = require('../models/orderModel')

const OrderService = {}

OrderService.create = (order) => {
  return database.Orders.create({
    distance: order.distance,
    status: order.status
  })
}

OrderService.findAll = function (result) {
  return database.Orders.findAll()
    .then((ordersData) => {
      var orders = []
      for (var o of ordersData) {
        var order = new Order(o.id, o.distance, o.status)
        orders.push(order)
      }

      return orders
    })
}

module.exports = OrderService
