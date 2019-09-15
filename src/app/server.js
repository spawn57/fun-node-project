'use strict'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const util = require('util')
const port = process.env.PORT || 3000
const logger = require('./services/logService')

logger.info('connecting and setting up database')
const database = require('./database/connection')
database.Orders
  .sync({ force: true })
  .then(() => {
    logger.info('database connection and setup successful')
  })
  .catch((error) => {
    logger.error(util.format('failed to connect to database: %s', error))
  })

logger.info('setting up routes')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const routes = require('./routes/orderRoutes')
routes(app)
app.get('/', (req, res) => res.send('<div id="greeting">Hello World</div>'))
app.listen(port, () => {
  logger.info(util.format('Example app listening on port %d', port))
})
logger.info('routes registered')
