'use strict';

var OrderService = require('../services/orderService');

exports.list = (request, response) => {
    OrderService.findAll(function(error, order) {
        console.log('fetching all orders');
        if (error) {
            response.send(error);
        }
        console.log('response', order);
        response.send(order);
    });
}