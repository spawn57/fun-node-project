'use strict'
var OrderController = require('../../../app/controllers/orderController')
var OrderService = require('../../../app/services/orderService')
var GoogleMapService = require('../../../app/services/googleMapsService')

describe('Order Controller', () => {
  var request
  var response

  beforeEach(() => {
    request = {
      params: {},
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

  describe('place order', () => {
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
  })

  describe('list', () => {
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
      request = {
        query: {
          page: 2,
          limit: 2
        },
        body: {
          status: 'SUCCESS'
        }
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

    it('list order fails when database has problems then throws an error', (done) => {
      spyOn(OrderService, 'findAll').and.returnValue(Promise.reject(Error('database failed')))
      OrderController.list(request, response)
        .then(() => {
          expect(OrderService.findAll).toHaveBeenCalled()
          expect(response.send).toHaveBeenCalledWith({ error: 'unable to fetch data from the database' })
          done()
        })
    })

    it('list order fails when page is not an integer then throws an error', () => {
      request.query = {
        page: 'hello',
        limit: 2
      }

      spyOn(OrderService, 'findAll')
      OrderController.list(request, response)

      expect(OrderService.findAll).not.toHaveBeenCalled()
      expect(response.send).toHaveBeenCalledWith({ error: 'failed to parse query parameters' })
    })

    it('list order fails when limit is not an integer then throws an error', () => {
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
  })

  describe('take order', () => {
    it('take order successfully then return success', (done) => {
      request.params.id = 1
      request.body = { status: 'TAKEN' }
      spyOn(OrderService, 'setTaken').and.returnValue(Promise.resolve({ status: 'SUCCESS' }))

      OrderController.takeOrder(request, response)
        .then(() => {
          expect(OrderService.setTaken).toHaveBeenCalled()
          expect(response.send).toHaveBeenCalledWith({ status: 'SUCCESS' })
          done()
        })
    })

    it('take order fails when body is invalid and throws an error', () => {
      request.params.id = 1
      request.body = { status: 'HELLO WORLD' }
      var errorInvalidStatus = Error('order requested to be said to invalid status')
      spyOn(OrderService, 'setTaken').and.returnValue(Promise.resolve({ status: 'SUCCESS' }))

      OrderController.takeOrder(request, response)

      expect(OrderService.setTaken).not.toHaveBeenCalled()
      expect(response.status).toHaveBeenCalledWith(400)
      expect(response.send).toHaveBeenCalledWith({ error: errorInvalidStatus.message })
    })

    it('take order fails request has no body and throws an error', () => {
      request.params.id = 1
      var errorInvalidStatus = Error('order requested to be said to invalid status')
      spyOn(OrderService, 'setTaken').and.returnValue(Promise.resolve({ status: 'SUCCESS' }))

      OrderController.takeOrder(request, response)

      expect(OrderService.setTaken).not.toHaveBeenCalled()
      expect(response.status).toHaveBeenCalledWith(400)
      expect(response.send).toHaveBeenCalledWith({ error: errorInvalidStatus.message })
    })

    it('take order fails when order is taken then throws error', (done) => {
      request.params.id = 1
      request.body = { status: 'TAKEN' }
      var errorAlreadyAssigned = Error('order has already been assigned')
      spyOn(OrderService, 'setTaken').and.returnValue(Promise.reject(errorAlreadyAssigned))

      OrderController.takeOrder(request, response)
        .then(() => {
          expect(OrderService.setTaken).toHaveBeenCalled()
          expect(response.status).toHaveBeenCalledWith(400)
          expect(response.send).toHaveBeenCalledWith({ error: errorAlreadyAssigned.message })
          done()
        })
    })

    it('take order fails when order doesn\'t exist then throws error', (done) => {
      request.params.id = 1
      request.body = { status: 'TAKEN' }
      var errorNoRecordFound = Error('order not found')
      spyOn(OrderService, 'setTaken').and.returnValue(Promise.reject(errorNoRecordFound))

      OrderController.takeOrder(request, response)
        .then(() => {
          expect(OrderService.setTaken).toHaveBeenCalled()
          expect(response.status).toHaveBeenCalledWith(400)
          expect(response.send).toHaveBeenCalledWith({ error: errorNoRecordFound.message })
          done()
        })
    })
  })
})
