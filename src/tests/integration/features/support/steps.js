const { Given, When, Then } = require('cucumber')
const axios = require('axios')
const chai = require('chai')
const connection = require('../../../../app/database/connection')

var scope = this

When('I post a request with origin coordinates {string},{string} and destination coordinates {string},{string}', (startLatitude, startLongitude, endLatitude, endLongitude) => {
  this.requestData = {
    origin: [startLatitude, startLongitude],
    destination: [endLatitude, endLongitude]
  }
})

Then('the place order request should be successful', () => {
  return axios.post('http://localhost:3000/orders', this.requestData)
    .then((response) => {
      scope.response = response
      chai.expect(response.status).to.eql(200)
    })
})

Then('the distance should be {int} and status should be unassigned', (distance) => {
  chai.expect(scope.response.data.distance).to.eql(distance)
  chai.expect(scope.response.data.status).to.eql('UNASSIGNED')
})

Then('the distance should be {float} and status should be unassigned', (distance) => {
  chai.expect(scope.response.data.distance).to.eql(distance)
  chai.expect(scope.response.data.status).to.eql('UNASSIGNED')
})

Given('the latest order', () => {
  return connection.Orders.create(
    {
      distance: 100,
      status: 'UNASSIGNED'
    })
    .then((order) => {
      scope.order = order
    })
})

When('I make a request for the list of orders', () => {
  return axios.get('http://localhost:3000/orders', {
    params: {
      page: 0,
      limit: 5
    }
  })
    .then((response) => {
      scope.response = response
      chai.expect(response.status).to.eql(200)
    })
})

Then('the order list request should be successful', () => {
  chai.expect(scope.response.status).to.eql(200)
})

Then('my new order should be there', () => {
  var order = {
    id: scope.order.id,
    distance: scope.order.distance,
    status: scope.order.status
  }
  chai.expect(scope.response.data).to.deep.include.members([order])
})
