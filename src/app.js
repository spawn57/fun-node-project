'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const database = require('./db')

console.log('connecting to database')
database.connect()
console.log('connection successful')

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
