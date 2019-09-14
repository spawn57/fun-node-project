'use strict'

const GoogleMapsService = require('../services/googleMapsService')
const Order = require('../models/orderModel')
const OrderService = require('../services/orderService')
const util = require('util')
const extraUtil = require('../util/extraUtil')

var OrderController = {}

OrderController.placeOrder = (request, response) => {
  var startLatitude, startLogitude, endLatitude, endLongitude
  try {
    console.log('parsing new order')
    startLatitude = extraUtil.parseFloat(request.body.origin[0])
    startLogitude = extraUtil.parseFloat(request.body.origin[1])
    endLatitude = extraUtil.parseFloat(request.body.destination[0])
    endLongitude = extraUtil.parseFloat(request.body.destination[1])
  } catch (error) {
    response.status(400).send(error)
  }
  console.log('calculating distance')
  return GoogleMapsService.calculateDistance(startLatitude, startLogitude, endLatitude, endLongitude)
    .then((distance) => {
      console.log('adding order')
      var order = new Order(null, distance, Order.STATUS_UNASSIGNED)
      return OrderService.create(order)
        .then((order) => {
          console.log(util.format('order added successfully with id %d', order.id))
          response.send(order)
        })
        .catch((error) => {
          response.status(400).send(new Error('unable to create new order', error))
        })
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
