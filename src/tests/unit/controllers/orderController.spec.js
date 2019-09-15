'use strict'
var OrderController = require('../../../app/controllers/orderController')
var OrderService = require('../../../app/services/orderService')
var GoogleMapService = require('../../../app/services/googleMapsService')

describe('Order Controller', () => {
  var request
  var response

  beforeEach(() => {
    request = {
      query: {},
      body: {}
    }
    response = {}
    response.send = jasmine.createSpy('send').and.returnValue(response)
    response.status = jasmine.createSpy('status').and.returnValue(response)
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
    spyOn(GoogleMapService, 'calculateDistance')
      .and.returnValue(Promise.resolve(mockDistance))
    spyOn(OrderService, 'create')
      .and.returnValue(Promise.resolve(mockData))

    request.body = {
      origin: ['22.314383', '114.172100'],
      destination: ['22.300367', '114.156597']
    }
    OrderController.placeOrder(request, response)
      .then(() => {
        expect(GoogleMapService.calculateDistance)
          .toHaveBeenCalledWith(22.314383, 114.172100, 22.300367, 114.156597)
        expect(OrderService.create).toHaveBeenCalled()
        expect(response.send).toHaveBeenCalledWith(jasmine.objectContaining(mockData))
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

  it('list order returns successful response with list of orders when page is 2 and page size is 2', (done) => {
    request.query = {
      page: 2,
      limit: 2
    }
    var mockData = [
      {
        id: 3,
        distance: 43,
        status: 'TAKEN'
      }
    ]
    spyOn(OrderService, 'findAll').and.returnValue(Promise.resolve(mockData))

    OrderController.list(request, response)
      .then(() => {
        expect(OrderService.findAll).toHaveBeenCalledWith(2, 2)
        expect(response.send).toHaveBeenCalledWith(mockData)
        done()
      })
  })

  it('list order throws an error', (done) => {
    spyOn(OrderService, 'findAll').and.returnValue(Promise.reject(Error('database failed')))
    OrderController.list(request, response)
      .then(() => {
        expect(OrderService.findAll).toHaveBeenCalled()
        expect(response.send).toHaveBeenCalledWith({ error: 'unable to fetch data from the database' })
        done()
      })
  })

  it('list order throws an error when page is not an integer', () => {
    request.query = {
      page: 'hello',
      limit: 2
    }

    spyOn(OrderService, 'findAll')
    OrderController.list(request, response)

    expect(OrderService.findAll).not.toHaveBeenCalled()
    expect(response.send).toHaveBeenCalledWith({ error: 'failed to parse query parameters' })
  })

  it('list order throws an error when limit is not an integer', () => {
    request.query = {
      page: 3,
      limit: {
        hello: 'world'
      }
    }

    spyOn(OrderService, 'findAll')
    OrderController.list(request, response)

    expect(OrderService.findAll).not.toHaveBeenCalled()
    expect(response.send).toHaveBeenCalledWith({ error: 'failed to parse query parameters' })
  })

  it('take order successfully then return success', (done) => {
    request.query.id = 1
    spyOn(OrderService, 'setTaken').and.returnValue(Promise.resolve({ status: 'SUCCESS' }))

    OrderController.takeOrder(request, response)
      .then(() => {
        expect(OrderService.setTaken).toHaveBeenCalled()
        expect(response.send).toHaveBeenCalledWith({ status: 'SUCCESS' })
        done()
      })
  })
})
