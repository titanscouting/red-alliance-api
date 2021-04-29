import express from 'express';
import expressMongoDb from 'mongo-express-req';
import { ValidationError } from 'express-validation';
import path from 'path';
import swaggerJSDoc = require('swagger-jsdoc');
import swaggerUi = require('swagger-ui-express');
// eslint-disable-next-line
// import * as swaggerDefinition from './routes/swagger.json';
import dbHandler = require('./dbHandler');
import auth = require('./authHandler');
import swaggerDefinition = require('./api-docs/index');

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

const swaggerSpec = swaggerJSDoc({ definition: swaggerDefinition.default, apis: ['./routes/*'] });
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
app.use('/docs/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

require('./routes/fetchScouters')(app, dbHandler);
require('./routes/submitMatchData')(app, dbHandler, auth);
require('./routes/fetchScouterSuggestions')(app, dbHandler);
require('./routes/fetchScouterUIDs')(app, dbHandler);
require('./routes/fetchPitConfig')(app, dbHandler, auth);
require('./routes/findTeamNickname')(app, dbHandler);
require('./routes/fetchAllTeamNicknamesAtCompetition')(app, dbHandler);
require('./routes/fetchCompetitionSchedule')(app, dbHandler);
require('./routes/fetchTeamSchedule')(app, dbHandler, auth);
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
require('./routes/fetchMatchConfig')(app, dbHandler, auth);
require('./routes/fetchMetricsData')(app, dbHandler);
require('./routes/fetchAnalysisFlags')(app, dbHandler, auth);
require('./routes/fetchAllTeamMatchData')(app, dbHandler);
require('./routes/fetchAllTeamPitData')(app, dbHandler);
require('./routes/fetchPitVariableData')(app, dbHandler);
require('./routes/getUserTeam')(app, auth);
require('./routes/submitTeamPitData')(app, dbHandler, auth);
require('./routes/submitTeamTestsData')(app, dbHandler, auth);
require('./routes/submitTeamMetricsData')(app, dbHandler, auth);
require('./routes/setAnalysisFlags')(app, dbHandler, auth);
require('./routes/fetchAPIConfig')(app);
require('./routes/fetchCompetitionFriendlyName')(app, dbHandler);
require('./routes/fetchTeamCompetition')(app, dbHandler, auth);
require('./routes/fetchTeamTestsData')(app, dbHandler, auth);
require('./routes/base')(app);

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
