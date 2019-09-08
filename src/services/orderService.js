'use strict';
var sql = require('../db');
var Order = require('../models/orderModel');

var OrderService = {};

OrderService.findAll = function (result) {
    sql.query('SELECT * FROM orders', function(error, response) {
        if (error) {
            console.log('error: ', error);
            result(null, error);
        } else {
            console.log('order: ', response);
            result(null, response);
        }
    })
};

module.exports = OrderService