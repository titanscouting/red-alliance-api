import express from 'express'
import bodyParser from 'body-parser'
import expressMongoDb from 'express-mongo-db'
import dbHandler = require('./dbHandler');
import auth = require('./authHandler');
const port = process.env.PORT || 8190;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Make sure to set the connection string as an environment variable
// e.g export REDALLIANCEDBKEY='fjsldjfksldfjaklfjsdalkfd'
try {
  app.use(expressMongoDb(process.env.REDALLIANCEDBKEY, { keepAlive: 1, connectTimeoutMS: 30000 }));
} catch (e) {
  console.log('Could not connect to the MongoDB instance');
  process.exit(1)
}

/**
 * NOTE TO DEVELOPERS: the `auth.checkAuth` statement is simply middleware which contacts
 * authHandler.js to ensure that the user has a valid authentication token.
 * Within the documentation, the token input for each authenticated route
 * (routes which require authentication) will be referred to as @param token.
*/

// All the routes should be written in different files so that this file doesn't become a behemoth
//requiring path and fs modules


// TODO: find a way to loop through this without a bunch of require(). A simple for loop results in `require() not found`.
require('./routes/base')(app);
require('./routes/fetchMatches')(app, dbHandler);
require('./routes/submitMatchData')(app, dbHandler, auth);
require('./routes/checkUser')(app, dbHandler, auth);
require('./routes/fetchScouterSuggestions')(app, dbHandler);
require('./routes/fetchScouterUIDs')(app, dbHandler);
require('./routes/fetchPitConfig')(app);
require('./routes/findTeamNickname')(app, dbHandler);
require('./routes/fetchAllTeamNicknamesAtCompetition')(app, dbHandler);
require('./routes/fetchMatchConfig')(app);
require('./routes/fetchCompetitionSchedule')(app, dbHandler);
require('./routes/fetch2022Schedule')(app, dbHandler);
require('./routes/fetchMatchData')(app, dbHandler);
require('./routes/addAPIKey')(app, dbHandler, auth);
require('./routes/privacyPolicy')(app);
require('./routes/addScouterToMatch')(app, dbHandler, auth);
require('./routes/removeScouterFromMatch')(app, dbHandler, auth);
require('./routes/submitStrategy')(app, dbHandler, auth);
require('./routes/fetchStrategy')(app, dbHandler);
require('./routes/getUserStrategy')(app, dbHandler, auth);
require('./routes/fetchPitData')(app, dbHandler);
require('./routes/submitPitData')(app, dbHandler, auth);

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
