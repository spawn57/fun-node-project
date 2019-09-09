const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  var Order = sequelize.define('orders', {
    distance: {
      type: Sequelize.FLOAT,
      field: 'distance'
    },
    status: {
      type: Sequelize.STRING,
      field: 'status'
    }
  })

  return Order
}
