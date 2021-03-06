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

    it('find all is successful then returns a list of orders when page is set to 2 and limit to 2 per page', (done) => {
      var mockData = [
        {
          id: 3,
          distance: 3,
          status: 'UNASSIGNED',
          createdAt: '2019-09-09T12:00:50.000Z',
          updatedAt: '2019-09-09T12:00:50.000Z'
        }
      ]
      spyOn(database.Orders, 'findAll').and.returnValue(Promise.resolve(mockData))

      orderService.findAll(2, 2)
        .then((orders) => {
          expect(database.Orders.findAll).toHaveBeenCalledWith({ offset: 2, limit: 2, order: [['createdAt', 'DESC']] })
          expect(orders.length).toEqual(1)
          expect(orders[0]).toEqual(jasmine.objectContaining({
            id: 3,
            distance: 3,
            status: 'UNASSIGNED'
          }))
          done()
        })
    })
  })

  describe('update', () => {
    it('set taken is successfull and returns successful status', (done) => {
      var mockData = {
        id: 3,
        distance: 3,
        status: 'UNASSIGNED',
        createdAt: '2019-09-09T12:00:50.000Z',
        updatedAt: '2019-09-09T12:00:50.000Z',
        save: () => {}
      }
      spyOn(mockData, 'save').and.returnValue(Promise.resolve(mockData))
      spyOn(database.Orders, 'findAll').and.returnValue(Promise.resolve([mockData]))

      orderService.setTaken(3)
        .then((order) => {
          expect(order.status).toEqual(Order.STATUS_TAKEN)
          done()
        })
    })

    it('set an taken order when order is already taken then throw error', (done) => {
      var mockData = {
        id: 3,
        distance: 3,
        status: 'TAKEN',
        createdAt: '2019-09-09T12:00:50.000Z',
        updatedAt: '2019-09-09T12:00:50.000Z',
        save: () => { }
      }
      spyOn(database.Orders, 'findAll').and.returnValue(Promise.resolve([mockData]))

      orderService.setTaken(3)
        .then(() => {
          fail()
        })
        .catch((error) => {
          expect(error).toEqual(Error('order has already been assigned'))
          done()
        })
    })

    it('set taken is fails and no record found when no records are found', (done) => {
      spyOn(database.Orders, 'findAll').and.returnValue(Promise.resolve([]))

      orderService.setTaken(1)
        .then(() => {
          fail()
        })
        .catch((error) => {
          expect(error).toEqual(Error('order not found'))
          done()
        })
    })
  })
})
