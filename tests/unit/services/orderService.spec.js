var orderService = require('../../../src/services/orderService')
var database = require('../../../src/database/connection')
var Order = require('../../../src/models/orderModel')

describe('Order Service', () => {
  it('test constructor', () => {
    expect(orderService).toBeTruthy()
  })

  describe('addOrder', () => {
    it('add Order successfully then return updated Order', (done) => {
      var mockOrder = {
        id: 1,
        distance: 1,
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
            distance: 1,
            status: 'UNASSIGNED'
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
})
