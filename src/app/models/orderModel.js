'use strict'

var Order = function (id, distance, status) {
  this.id = id
  this.distance = distance
  this.status = status
}

Order.STATUS_UNASSIGNED = 'UNASSIGNED'
Order.STATUS_TAKEN = 'TAKEN'

module.exports = Order
