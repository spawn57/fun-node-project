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

OrderController.takeOrder = (request, response) => {
  console.log('taking order for id: ' + request.params.id)
  var id = Number.parseInt(request.params.id)

  if (isNaN(id)) {
    response.status(400).send({ error: 'id must be an integer' })
    return
  }

  return OrderService.setTaken(id)
    .then((result) => {
      console.log('order set to taken')
      response.send(result)
    },
    (error) => {
      console.log('could take order: ' + id)
      console.log(error)
      response.status(400).send({ error: 'order not found' })
    })
}

module.exports = OrderController
