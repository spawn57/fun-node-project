const expect = require('chai').expect;

module.exports = function () {    
    
  this.When(/^I load the homepage$/, () => {
    return helpers.loadPage('http://localhost:3000');
  })

  this.Then(/^I should see Hello World$/, () => {
    return driver.wait(until.elementsLocated(by.id('greeting')), 10000)
    .then(() => {
      driver.findElement(by.id('greeting')).getText()
      .then(t => {
        try {
          expect(t).to.be.eql("Hello World")
        }
        catch(e) {
          return Promise.reject(false)
        }
      })        
    })
  })
};