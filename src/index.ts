import express from 'express';
import bodyParser from 'body-parser';
import expressMongoDb from 'mongo-express-req';
import { ValidationError } from 'express-validation';
import path from 'path';
import swaggerJSDoc = require('swagger-jsdoc');
import swaggerUi = require('swagger-ui-express');
// eslint-disable-next-line
import * as swaggerDefinition from './routes/swagger.json';
import dbHandler = require('./dbHandler');
import auth = require('./authHandler');

const port = process.env.PORT || 8190;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
  apis: ['./routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
/**
 * NOTE TO DEVELOPERS: the `auth.checkAuth` statement is simply middleware which contacts
 * authHandler.ts to ensure that the user has a valid authentication token.
 * Within the documentation, the token input for each authenticated route
 * (routes which require authentication) will be referred to as @param token.
*/

// All the routes should be written in different files so that this file doesn't become a behemoth
// requiring path and fs modules

// TODO: find a way to loop through this without a bunch of require(). A simple for loop results in `require() not found`.
// TODO: use the UserReturnData class when returning data in all these apis

require('./routes/fetchScouters')(app, dbHandler);
require('./routes/submitMatchData')(app, dbHandler, auth);
require('./routes/checkUser')(app, dbHandler, auth);
require('./routes/fetchScouterSuggestions')(app, dbHandler);
require('./routes/fetchScouterUIDs')(app, dbHandler);
require('./routes/fetchPitConfig')(app, dbHandler);
require('./routes/findTeamNickname')(app, dbHandler);
require('./routes/fetchAllTeamNicknamesAtCompetition')(app, dbHandler);
require('./routes/fetchCompetitionSchedule')(app, dbHandler);
require('./routes/fetch2022Schedule')(app, dbHandler);
require('./routes/fetchMatchData')(app, dbHandler);
require('./routes/addAPIKey')(app, dbHandler, auth);
require('./routes/privacyPolicy')(app);
require('./routes/addScouterToMatch')(app, dbHandler, auth);
require('./routes/removeScouterFromMatch')(app, dbHandler, auth);
require('./routes/submitStrategy')(app, dbHandler, auth);
require('./routes/fetchStrategy')(app, dbHandler);
require('./routes/fetchUserStrategy')(app, dbHandler, auth);
require('./routes/fetchPitData')(app, dbHandler);
require('./routes/submitPitData')(app, dbHandler, auth);
require('./routes/addUserToTeam')(app, dbHandler, auth);
require('./routes/fetchMatchConfig')(app, dbHandler);
require('./routes/fetchMetricsData')(app, dbHandler);
require('./routes/fetchAnalysisFlags')(app, dbHandler);
require('./routes/fetchAllTeamMatchData')(app, dbHandler);
require('./routes/fetchAllTeamPitData')(app, dbHandler);
require('./routes/fetchPitVariableData')(app, dbHandler);
require('./routes/submitTeamTestsData')(app, dbHandler, auth);
require('./routes/submitTeamPitData')(app, dbHandler, auth);
require('./routes/getUserTeam')(app, auth);

class CustomValidationError extends ValidationError {
  success?: boolean

  constructor() {
    super();
    this.success = false;
  }
}
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
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
