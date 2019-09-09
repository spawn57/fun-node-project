'use strict'

var GoogleMapsService = require('../services/googleMapsService')
var Order = require('../models/orderModel')
var OrderService = require('../services/orderService')

var OrderController = {}

OrderController.placeOrder = (request, response) => {
  console.log('calculating distance')
  var distance = GoogleMapsService.calculateDistance()
  console.log('adding order')
  var order = new Order(null, distance, Order.STATUS_UNASSIGNED)
  return OrderService.create(order)
    .then((order) => {
      response.send(order)
    })
    .catch((error) => {
      response.send(new Error('unable to create new order', error))
    })
}

OrderController.list = (request, response) => {
  return OrderService.findAll()
    .then((orders) => {
      response.send(orders)
    })
    .catch((error) => {
      response.send(new Error('unable to fetch data from the database', error))
    })
}

module.exports = OrderController
