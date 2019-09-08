'use strict';

module.exports = function(app) {
    var orders = require('../controllers/orderController');

    app.route('/list')
        .get(orders.list)
}