'use strict'

var GoogleMapsService = require('../services/googleMapsService')
var Order = require('../models/orderModel')
var OrderService = require('../services/orderService')
const uuidv4 = require('uuid/v4')

var OrderController = {}

OrderController.placeOrder = (request, response) => {
  console.log('calculating distance')
  var distance = GoogleMapsService.calculateDistance()
  console.log('adding order')
  var order = new Order(uuidv4(), distance, Order.STATUS_UNASSIGNED)
  OrderService.addOrder(order, (error, order) => {
    if (error) {
      response.send(error)
    }
    console.log('order ' + order.uuid + ' added successfully')
    response.send(order)
  })
}

OrderController.list = (request, response) => {
  OrderService.findAll((error, order) => {
    console.log('fetching all orders')
    if (error) {
      response.send(error)
    }
    console.log('orders fetched succesfully')
    response.send(order)
  })
}

module.exports = OrderController
