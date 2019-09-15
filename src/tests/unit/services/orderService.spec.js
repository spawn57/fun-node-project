var orderService = require('../../../app/services/orderService')
var database = require('../../../app/database/connection')
var Order = require('../../../app/models/orderModel')

describe('Order Service', () => {
  it('test constructor', () => {
    expect(orderService).toBeTruthy()
  })

  describe('addOrder', () => {
    it('add Order successfully then return updated Order', (done) => {
      var mockOrder = {
        id: 1,
        distance: 200,
        status: 'UNASSIGNED',
        createdAt: '2019-09-09T12:00:50.000Z',
        updatedAt: '2019-09-09T12:00:50.000Z'
      }
      spyOn(database.Orders, 'create').and.returnValue(Promise.resolve(mockOrder))

      var order = new Order(null, 1, 'UNASSIGNED')
      orderService.create(order)
        .then((order) => {
          expect(database.Orders.create).toHaveBeenCalled()
          expect(order).toEqual(jasmine.objectContaining({
            id: 1,
            distance: 200,
            status: 'UNASSIGNED',
            createdAt: '2019-09-09T12:00:50.000Z',
            updatedAt: '2019-09-09T12:00:50.000Z'
          }))
          done()
        })
    })
  })

  describe('findAll', () => {
    it('find all is successful then returns a list of empty orders', (done) => {
      spyOn(database.Orders, 'findAll').and.returnValue(Promise.resolve([]))

      orderService.findAll()
        .then((orders) => {
          expect(database.Orders.findAll).toHaveBeenCalled()
          expect(orders).toEqual([])
          done()
        })
    })

    it('find all is successful then returns a list of orders', (done) => {
      var mockData = [
        {
          id: 1,
          distance: 1,
          status: 'UNASSIGNED',
          createdAt: '2019-09-09T12:00:50.000Z',
          updatedAt: '2019-09-09T12:00:50.000Z'
        },
        {
          id: 1,
          distance: 1,
          status: 'UNASSIGNED',
          createdAt: '2019-09-09T12:00:50.000Z',
          updatedAt: '2019-09-09T12:00:50.000Z'
        },
        {
          id: 1,
          distance: 1,
          status: 'UNASSIGNED',
          createdAt: '2019-09-09T12:00:50.000Z',
          updatedAt: '2019-09-09T12:00:50.000Z'
        }
      ]
      spyOn(database.Orders, 'findAll').and.returnValue(Promise.resolve(mockData))

      orderService.findAll()
        .then((orders) => {
          expect(database.Orders.findAll).toHaveBeenCalled()
          for (var order of orders) {
            expect(order).toEqual(jasmine.objectContaining({
              id: 1,
              distance: 1,
              status: 'UNASSIGNED'
            }))
          }
          done()
        })
    })
  })

  describe('update', () => {
    it('set taken is successfull and returns successful status', (done) => {
      var numberOfRecordsUpdated = [1]
      spyOn(database.Orders, 'update').and.returnValue(Promise.resolve(numberOfRecordsUpdated))

      orderService.setTaken(1)
        .then((status) => {
          expect(status).toEqual({ status: 'SUCCESS' })
          done()
        })
    })

    it('set taken is fails and no record found when no records are updated', (done) => {
      var numberOfRecordsUpdated = [0]
      spyOn(database.Orders, 'update').and.returnValue(Promise.resolve(numberOfRecordsUpdated))

      orderService.setTaken(1)
        .catch((error) => {
          expect(error).toEqual(Error('no record found'))
          done()
        })
    })
  })
})
