'use strict'

const axios = require('axios')
const util = require('util')

const API_KEY = 'AIzaSyBQkQMNtW-UZaKANxkoAYbGi8vdxdQV7Zg'
const ENDPOINT = 'https://maps.googleapis.com/maps/api/distancematrix/json'
const MODE_DRIVING = 'driving'

var GoogleMapsService = {}

GoogleMapsService.calculateDistance = (startLatitude, startLongitude, endLatitude, endLongitude) => {
  return axios.get(ENDPOINT, {
    params: {
      mode: MODE_DRIVING,
      origins: util.format('%d,%d', startLatitude, startLongitude),
      destinations: util.format('%d,%d', endLatitude, endLongitude),
      key: API_KEY
    }
  }).then((response) => {
    try {
      if (response.data.status === 'OK') {
        return response.data.rows[0].elements[0].distance.value
      } else {
        throw Error('failed to determine distance')
      }
    } catch (error) {
      throw Error('failed to determine distance')
    }
  })
}

module.exports = GoogleMapsService
