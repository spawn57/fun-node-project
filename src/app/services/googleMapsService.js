'use strict'

const axios = require('axios')
const util = require('util')
const logger = require('./logService')
const config = require('../config.json')

const ENDPOINT = 'https://maps.googleapis.com/maps/api/distancematrix/json'
const MODE_DRIVING = 'driving'

var GoogleMapsService = {}

GoogleMapsService.calculateDistance = (startLatitude, startLongitude, endLatitude, endLongitude) => {
  logger.info('making request to google maps api')
  return axios.get(ENDPOINT, {
    params: {
      mode: MODE_DRIVING,
      origins: util.format('%d,%d', startLatitude, startLongitude),
      destinations: util.format('%d,%d', endLatitude, endLongitude),
      key: config.googleMaps.key
    }
  }).then((response) => {
    logger.info(util.format('received response: %s', response.data))
    try {
      if (response.data.status === 'OK') {
        var distance = response.data.rows[0].elements[0].distance.value
        logger.info(util.format('distance is: %s', distance))
        return distance
      } else {
        logger.error('failed to determine distance')
        throw Error('failed to determine distance')
      }
    } catch (error) {
      logger.error(util.format('failed to determine distance: %s', error))
      throw Error('failed to determine distance')
    }
  })
}

module.exports = GoogleMapsService
