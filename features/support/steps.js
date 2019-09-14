const { When, Then } = require('cucumber')
const axios = require('axios')
const chai = require('chai')

When('I post a request with origin coordinates {string},{string} and destination coordinates {string},{string}', (startLatitude, startLongitude, endLatitude, endLongitude) => {
  this.requestData = {
    origin: [startLatitude, startLongitude],
    destination: [endLatitude, endLongitude]
  }
})

Then('the request should be successful', () => {
  return axios.post('http://localhost:3000/orders', this.requestData)
    .then((response) => {
      this.responseData = response.data
      chai.expect(response.status).to.eql(200)
    })
})

Then('the distance should be {int} and status should be unassigned', (distance) => {
  chai.expect(this.responseData.distance).to.eql(distance)
  chai.expect(this.responseData.status).to.eql('UNASSIGNED')
})

Then('the distance should be {float} and status should be unassigned', (distance) => {
  chai.expect(this.responseData.distance).to.eql(distance)
  chai.expect(this.responseData.status).to.eql('UNASSIGNED')
})
