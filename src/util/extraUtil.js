'use strict'
const util = require('util')

const extraUtil = {}

extraUtil.parseFloat = (value) => {
  var parsedValue = Number.parseFloat(value)

  if (isNaN(parsedValue)) {
    throw Error(util.format('could not parse %s as a float', value))
  }
  return parsedValue
}

extraUtil.parseInteger = (value) => {
  var parsedInteger = Number.parseInt(value)

  if (isNaN(parsedInteger)) {
    throw Error(util.format('could not parse %s as an integer', value))
  }
  return parsedInteger
}

module.exports = extraUtil
