'use strict'

console.log('initializing')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000

console.log('connecting and setting up database')
const database = require('./database/connection')
console.log('database connection and setup successful')
database.Orders
  .sync({ force: true })
  // .then(() => {
  //   database.Orders.create({
  //     distance: 1,
  //     status: 'UNASSIGNED'
  //   }).then((order) => {
  //     console.log('created entry')
  //     console.log(order)
  //   })
  // })

console.log('setting up routes')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
var routes = require('./routes/orderRoutes')
routes(app)
app.get('/', (req, res) => res.send('<div id="greeting">Hello World</div>'))
app.listen(port, () => {
  console.log('Example app listening on port 3000')
})
console.log('routes registered')
