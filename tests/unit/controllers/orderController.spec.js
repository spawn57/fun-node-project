'use strict';
var OrderController = require('../../../src/controllers/orderController')
var OrderService = require('../../../src/services/orderService')
var GoogleMapService = require('../../../src/services/googleMapsService')

describe('Order Controller', () => {
  var request
  var response

  beforeEach(() => {
    request = {
      params: {}
    }
    response = jasmine.createSpyObj('response', ['send'])
  })

  it('test constructor', () => {
    expect(OrderController).toBeTruthy()
  })

  it('place order returns successful response', (done) => {
    var mockDistance = 10
    var mockData = {
      id: 1,
      distance: mockDistance,
      status: 'UNASSIGNED'
    }
    spyOn(GoogleMapService, 'calculateDistance').and.returnValue(mockDistance)
    spyOn(OrderService, 'create').and.returnValue(Promise.resolve(mockData))

    OrderController.placeOrder(request, response)
      .then(() => {
        expect(OrderService.create).toHaveBeenCalled()
        expect(response.send).toHaveBeenCalledWith(mockData)
        done()
      })
  })

  it('list order returns successful response with list of orders', (done) => {
    var mockData = [
      {
        id: 1,
        distance: 1,
        status: 'UNASSIGNED'
      },
      {
        id: 2,
        distance: 2,
        status: 'UNASSIGNED'
      },
      {
        id: 3,
        distance: 43,
        status: 'TAKEN'
      }
    ]
    spyOn(OrderService, 'findAll').and.returnValue(Promise.resolve(mockData))

    OrderController.list(request, response)
      .then(() => {
        expect(OrderService.findAll).toHaveBeenCalled()
        expect(response.send).toHaveBeenCalledWith(mockData)
        done()
      })
  })

  it('list order throws an error', (done) => {
    spyOn(OrderService, 'findAll').and.returnValue(Promise.reject(Error('database failed')))
    OrderController.list(request, response)
      .then(() => {
        expect(OrderService.findAll).toHaveBeenCalled()
        expect(response.send).toHaveBeenCalledWith(Error('unable to fetch data from the database'))
        done()
      })
  })

  it('take order successfully then return success', (done) => {
    request.params.id = 1
    spyOn(OrderService, 'setTaken').and.returnValue(Promise.resolve({ status: 'SUCCESS' }))

    OrderController.takeOrder(request, response)
      .then(() => {
        expect(OrderService.setTaken).toHaveBeenCalled()
        expect(response.send).toHaveBeenCalledWith({ status: 'SUCCESS' })
        done()
      })
  })
})
