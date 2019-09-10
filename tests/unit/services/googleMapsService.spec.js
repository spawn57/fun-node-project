const googleMapsService = require('../../../src/services/googleMapsService');
const axios = require('axios')

describe('Google Map Service', () => {
  it('test google maps service constructor', () => {
    expect(googleMapsService).toBeTruthy()
  })

  describe('calculateDistance returns successful result', () => {
    fit('test calculate distance returns 1', (done) => {
      const mockResponse = {
        data: {
          destination_addresses: [
            'Northbound Clark Dr @ E 1st Ave, Vancouver, BC V5N 1A1, Canada'
          ],
          origin_addresses: [
            'Clarendon Ave & Clarendon Woods S, San Francisco, CA 94131, USA'
          ],
          rows: [
            {
              elements: [
                {
                  distance: {
                    text: '1,533 km',
                    value: 1533219
                  },
                  duration: {
                    text: '15 hours 9 mins',
                    value: 54560
                  },
                  status: 'OK'
                }
              ]
            }
          ],
          status: 'OK'
        }
      }
      spyOn(axios, 'get').and.returnValue(Promise.resolve(mockResponse))

      googleMapsService.calculateDistance(37.750679, -122.458011, 49.270087, -123.077859)
        .then((distance) => {
          expect(distance).toEqual(1533219)
          done()
        })
    })
  })
})
