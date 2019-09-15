const winston = require('winston')
const LOG = {
  LEVELS: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
  },
  FILE: 'application.log'
}
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: LOG.FILE })
  ]
})
module.exports = logger
