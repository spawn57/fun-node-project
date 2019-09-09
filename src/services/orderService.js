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

OrderService.findAll = (result) => {
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

OrderService.setTaken = (id) => {
  return database.Orders.update(
    { status: Order.STATUS_TAKEN },
    { where: { id: id } }
  ).then((numberOfRowsUpdated) => {
    if (numberOfRowsUpdated[0] === 0) {
      return Promise.reject(Error('no record found'))
    } else {
      return ({ status: 'SUCCESS' })
    }
  })
}

module.exports = OrderService
