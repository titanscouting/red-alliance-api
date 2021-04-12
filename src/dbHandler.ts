/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/order */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

/**
 * @module dbHandler
 */

import fs = require('fs')
import path = require('path')

// import all the handlers from directory, avoid wall of exports
const handlers = fs.readdirSync(path.join(__dirname, 'db-handlers')).filter((file) => file.includes('.ts'))
handlers.forEach((handler) => {
  module.exports[handler.replace('.ts', '')] = require(path.join(__dirname, 'db-handlers', handler))
})
