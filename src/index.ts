import express from 'express';
import expressMongoDb from 'mongo-express-req';
import { ValidationError } from 'express-validation';
import morgan from 'morgan'
import { rateLimit } from 'express-rate-limit';
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
// eslint-disable-next-line
const redis = require('redis');
const port = process.env.PORT || 8190;
const app = express();
const server = app.listen(port, () => console.log(`Listening on port ${port}`));
const globalIO = require('socket.io')(server, {
  cors: true,
  origins: ['*'],
});
const dbHandler = require('./dbHandler');
const auth = require('./authHandler');
const swaggerDefinition = require('./api-docs/index');

require('dotenv').config()
// request logging
morgan.token('visitor-addr', function(req,res){
  if (req.headers['cdn-loop'] == 'cloudflare') {
    return req.headers['cf-connecting-ip'] + " (through Cloudflare)"
  } else {
    return req.ip + " (direct)"
  }
})
morgan.token('user-email', function(req,res){
  return res.locals.email || "anonymous";
})
app.use(morgan('[:date[clf]] :visitor-addr <:user-email>  ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.TRA_DISABLE_APIKEY_CHECKS) {
  console.warn("Warning: NoAPIKey checks disabled.")
}
if (process.env.TRA_TESTING) {
  console.warn("Warning: Running in testing mode. Some checks are disabled.")
}
//rate limiting for some endpoints
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  message: "Rate limited.",
  standardHeaders: true
});
app.use("/privacy-policy", limiter);
app.use("/api/addAPIKey", limiter);
app.use("/api/broadcastTeamMessage", limiter);
app.use("/api/addUserToTeam", limiter);

// redis connection for TBA caching
const redisClient = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' })

redisClient.on('error', (err) => { console.log('Redis Client Error (redis disabled)'); process.env.REDIS = 'true'; console.log(err) });
redisClient.on('connect', () => { console.log('Redis Client Connected!'); delete process.env.REDIS; });
redisClient.connect();

globalIO.on('connection', (socket) => {
  socket.emit('serverBroadcastMessage', {
    message: 'Connected to the Titan Scouting event socket!',
  });
})

app.use((req, res, next) => {
  // eslint-disable-next-line global-require
  res.locals.io = globalIO;
  next();
})
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

// ideally find a way to loop through this without a bunch of require(). A simple for loop results in `require() not found`.
app.use('/docs/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

require('./routes/fetchScouters')(app, dbHandler, auth);
require('./routes/submitMatchData')(app, dbHandler, auth);
require('./routes/fetchScouterSuggestions')(app, dbHandler, auth);
require('./routes/fetchScouterUIDs')(app, dbHandler, auth);
require('./routes/fetchPitConfig')(app, dbHandler, auth);
require('./routes/findTeamNickname')(app, dbHandler);
require('./routes/fetchAllTeamNicknamesAtCompetition')(app, dbHandler);
require('./routes/fetchCompetitionSchedule')(app, dbHandler, auth, redisClient);
require('./routes/fetchTeamSchedule')(app, dbHandler, auth);
require('./routes/fetchMatchData')(app, dbHandler, auth);
require('./routes/addAPIKey')(app, dbHandler, auth);
require('./routes/privacyPolicy')(app);
require('./routes/addScouterToMatch')(app, dbHandler, auth);
require('./routes/removeScouterFromMatch')(app, dbHandler, auth);
require('./routes/submitStrategy')(app, dbHandler, auth);
require('./routes/fetchStrategy')(app, dbHandler, auth);
require('./routes/fetchUserStrategy')(app, dbHandler, auth);
require('./routes/fetchPitData')(app, dbHandler, auth);
require('./routes/submitPitData')(app, dbHandler, auth);
require('./routes/addUserToTeam')(app, dbHandler, auth);
require('./routes/fetchMatchConfig')(app, dbHandler, auth);
require('./routes/fetchMetricsData')(app, dbHandler, auth);
require('./routes/fetchAnalysisFlags')(app, dbHandler, auth);
require('./routes/fetchAllTeamMatchData')(app, dbHandler, auth);
require('./routes/fetchAllTeamPitData')(app, dbHandler, auth);
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
require('./routes/addMatchToCompetition')(app, dbHandler, auth);
require('./routes/broadcastTeamMessage')(app, auth);
require('./routes/base')(app);

class CustomValidationError extends ValidationError {
  success?: boolean

  constructor(errors, options) {
    super(errors, options);
    this.success = false;
  }
}

app.use((req, res) => {
  res.status(404).json({ success: false, reasons: ['404: Page Not Found'] });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: express.Request, res: express.Response, next) => {
  if (err instanceof ValidationError) {
    // eslint-disable-next-line
    const err2: CustomValidationError = err
    err2.success = false;
    return res.status(err.statusCode).json(err2)
  }

  return res.status(500).json(err)
})

module.exports = app;
