'use strict'

const GoogleMapsService = require('../services/googleMapsService')
const Order = require('../models/orderModel')
const OrderService = require('../services/orderService')
const util = require('util')
const extraUtil = require('../util/extraUtil')
const logger = require('../services/logService')

var OrderController = {}

OrderController.placeOrder = (request, response) => {
  var startLatitude, startLogitude, endLatitude, endLongitude
  try {
    logger.info('parsing new order')
    startLatitude = extraUtil.parseFloat(request.body.origin[0])
    startLogitude = extraUtil.parseFloat(request.body.origin[1])
    endLatitude = extraUtil.parseFloat(request.body.destination[0])
    endLongitude = extraUtil.parseFloat(request.body.destination[1])
  } catch (error) {
    logger.error('failed to parse coordinates: %s', error)
    response.status(400).send({ error: 'failed to parse coordinates' })
  }
  logger.info(
    'calculating distance using google api with orign [%d, %d], desination [%d, %d]',
    startLatitude,
    startLogitude,
    endLatitude,
    endLongitude)
  return GoogleMapsService.calculateDistance(startLatitude, startLogitude, endLatitude, endLongitude)
    .then((distance) => {
      logger.info('adding order')
      var order = new Order(null, distance, Order.STATUS_UNASSIGNED)
      return OrderService.create(order)
        .then((order) => {
          logger.info(util.format('order added successfully with id %d', order.id))
          response.send(order)
        })
        .catch((error) => {
          logger.error('unable to create order: %s', error)
          response.status(400).send({ error: 'unable to create new order' })
        })
    })
}

OrderController.list = (request, response) => {
  return OrderService.findAll()
    .then((orders) => {
      response.send(orders)
    })
    .catch((error) => {
      logger.error('unable to fetch data from the database: %s', error)
      response.send({ error: 'unable to fetch data from the database' })
    })
}

OrderController.takeOrder = (request, response) => {
  logger.info(util.format('taking order for id: %s', request.params.id))
  var id = Number.parseInt(request.params.id)

  if (isNaN(id)) {
    logger.error('id %s must be an integer', id)
    response.status(400).send({ error: 'id must be an integer' })
    return
  }

  return OrderService.setTaken(id)
    .then((result) => {
      logger.info('order set to taken')
      response.send(result)
    },
    (error) => {
      logger.error(util.format('could take order: %d: %s', id, error))
      response.status(400).send({ error: 'order not found' })
    })
}

module.exports = OrderController
