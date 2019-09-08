'use strict'

var Order = function (uuid, distance, status) {
  this.uuid = uuid
  this.distance = distance
  this.status = status
}

Order.STATUS_UNASSIGNED = 'UNASSIGNED'
Order.STATUS_TAKEN = 'TAKEN'

module.exports = Order
