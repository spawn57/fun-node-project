'use strict'

var Order = (order) => {
    this.uuid = order.uuid;
    this.distance = order.distance;
    this.status = order.status;
}

module.exports = Order