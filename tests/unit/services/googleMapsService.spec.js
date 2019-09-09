var googleMapsService = require('../../../src/services/googleMapsService');

describe('Google Map Service', () => {
  it('test google maps service constructor', () => {
    expect(googleMapsService).toBeTruthy();
  });

  describe('calculateDistance', () => {
    it('test calculate distance returns 1', () => {
      var distance = googleMapsService.calculateDistance();
      expect(distance).toBe(1);
    })
  })
})