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
  logger.info(util.format(
    'calculating distance using google api with orign [%d, %d], desination [%d, %d]',
    startLatitude,
    startLogitude,
    endLatitude,
    endLongitude))
  return GoogleMapsService.calculateDistance(startLatitude, startLogitude, endLatitude, endLongitude)
    .then((distance) => {
      logger.info('adding order')
      var order = new Order(null, distance, Order.STATUS_UNASSIGNED)
      return OrderService.create(order)
        .then((order) => {
          logger.info(util.format('order added successfully with id %d', order.id))
          response.send(new Order(order.id, order.distance, order.status))
        })
        .catch((error) => {
          logger.error('unable to create order: %s', error)
          response.status(400).send({ error: 'unable to create new order' })
        })
    })
}

OrderController.list = (request, response) => {
  var page = OrderService.DEFAULT_PAGE
  var limit = OrderService.DEFAULT_PAGE_SIZE
  try {
    logger.info(util.format('received list request: %s', request))
    if (request.query.page) {
      page = extraUtil.parseInteger(request.query.page)
    }
    if (request.query.limit) {
      limit = extraUtil.parseInteger(request.query.limit)
    }
  } catch (error) {
    logger.error('failed to parse query parameters: %s and %s', request.query.page, request.query.limit)
    response.status(400).send({ error: 'failed to parse query parameters' })
    return
  }
  logger.info(util.format('query database for page %d and offset %d', page, limit))
  return OrderService.findAll(page, limit)
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

  if (request.body.status !== Order.STATUS_TAKEN) {
    response.status(400).send({ error: 'order requested to be said to invalid status' })
    return
  }

  return OrderService.setTaken(id)
    .then((order) => {
      logger.info(util.format('order with {int} set to taken', id))
      response.send({ status: 'SUCCESS' })
    },
    (error) => {
      logger.error(util.format('could take order: %d: %s', id, error))
      response.status(400).send({ error: error.message })
    })
}

module.exports = OrderController
