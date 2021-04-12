import express from 'express';
import expressMongoDb from 'mongo-express-req';
import { ValidationError } from 'express-validation';
import path from 'path';
import fs = require('fs');
import swaggerJSDoc = require('swagger-jsdoc');
import swaggerUi = require('swagger-ui-express');
// eslint-disable-next-line
import * as swaggerDefinition from './routes/swagger.json';
import auth = require('./authHandler');

const dbHandler = require('./dbHandler'); // MUST USE const and not import - to facilitate dynamic exports, we use module.exports

const port = process.env.PORT || 8190;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Make sure to set the connection string as an environment variable
// e.g export REDALLIANCEDBKEY='mongodb+srv://<user>:<pass>@<url>/<path>?<opts>'
try {
  app.use(expressMongoDb(process.env.REDALLIANCEDBKEY, { keepAlive: 1, connectTimeoutMS: 30000, useUnifiedTopology: true }));
} catch (e) {
  console.log('Could not connect to the MongoDB instance');
  console.error(e)
  process.exit(1);
}

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/swagger.json'],
};

const swaggerSpec = swaggerJSDoc(options);

// All the routes should be written in different files so that this file doesn't become a behemoth

// TODO: use the UserReturnData class when returning data in all these apis
app.use('/docs/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const routes = fs.readdirSync(path.join(__dirname, 'routes')).filter((item) => item.includes('.ts'))
routes.forEach((route) => {
  require(path.join(__dirname, 'routes', route))(app, dbHandler, auth)
})

class CustomValidationError extends ValidationError {
  success?: boolean

  constructor() {
    super();
    this.success = false;
  }
}

app.use((req, res) => {
  res.status(404).json({ success: true, reasons: ['404: Page Not Found'] });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req, res, next) => {
  if (err instanceof ValidationError) {
    // eslint-disable-next-line
    const err2: CustomValidationError = err
    err2.success = false;
    return res.status(err.statusCode).json(err2)
  }

  return res.status(500).json(err)
})

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
