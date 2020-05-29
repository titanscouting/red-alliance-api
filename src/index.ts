import express from 'express'
import bodyParser from 'body-parser'
import expressMongoDb from 'express-mongo-db'
import uuidAPIKey from 'uuid-apikey'
import dbHandler = require('./dbHandler');
import auth = require('./authHandler');

const port = process.env.PORT || 8190;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const options = {
  keepAlive: 1, connectTimeoutMS: 30000,
};

// Make sure to set the connection string as an environment variable
// e.g export REDALLIANCEDBKEY='fjsldjfksldfjaklfjsdalkfd'
try {
  app.use(expressMongoDb(process.env.REDALLIANCEDBKEY, options));
} catch (e) {
  console.log('Could not connect to the MongoDB instance');
}

/**
 * NOTE TO DEVELOPERS: the `auth.checkAuth` statement is simply middleware which contacts
 * authHandler.js to ensure that the user has a valid authentication token.
 * Within the documentation, the token input for each authenticated route
 * (routes which require authentication) will be referred to as @param token.
*/

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

/**
 * GET route '/api/fetchCompetitionSchedule'
 * Allows the application to get all the matches for a given competition.
 * @param competition is the Competition id: e.g. '2020ilch'.
 * @returns back to the client let resobj (competition and ) and HTTP Status Code 200 OK.
 */
app.get('/api/fetchCompetitionSchedule', async (req: any, res:any) => {
  let val;
  const competition = String(req.query.competition);
  try {
    val = await dbHandler.fetchCompetitionSchedule(req.db, competition).catch((e) => { console.error(e); val.err_occur = true; });
  } catch (e) {
    console.error(e);
    val.err_occur = true;
  }
  let resobj = null;
  if (val.err_occur === false) {
    resobj = {
      success: true,
      competition,
      data: val.data,
    };
  } else {
    resobj = {
      success: false,
      reasons: val.err_reasons,
    };
  }
  res.json(resobj);
});
app.get('/api/fetch2022Schedule', async (req: any, res:any) => {
  let val;
  const competition = String(req.query.competition);
  try {
    val = await dbHandler.fetch2022Schedule(req.db, competition).catch((e) => { console.error(e); val.err_occur = true; });
  } catch (e) {
    console.error(e);
    val.err_occur = true;
  }
  let resobj = null;
  if (val.err_occur === false) {
    resobj = {
      success: true,
      competition,
      data: val.data,
    };
  } else {
    resobj = {
      success: false,
      reasons: val.err_reasons,
    };
  }
  res.json(resobj);
});

app.get('/api/fetchMatchData', async (req: any, res:any) => {
  let val;
  const competitionID = String(req.query.competition);
  const matchNumber = parseInt(req.query.match_number, 10);
  const teamScouted = parseInt(req.query.team_scouted, 10);
  try {
    val = await dbHandler.fetchMatchData(req.db, competitionID, matchNumber, teamScouted).catch((e) => { console.error(e); val.err_occur = true; });
  } catch (err) {
    console.error(err);
    val.err_occur = true;
  }
  // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
  let dataInterim;
  try {
    dataInterim = val.data.data;
  } catch (e) {
    val.err_occur = true;
  }
  let resobj = null;
  if (val.err_occur === false) {
    resobj = {
      success: true,
      competition: competitionID,
      matchNumber,
      teamScouted,
      data: dataInterim,
    };
  } else {
    resobj = {
      success: false,
      reasons: val.err_reasons,
    };
  }
  res.json(resobj);
});

// app.get('/api/fetchShotChartData', async (req: any, res:any) => {
//   let val;
//   const competitionID = String(req.body.competitionID);
//   const matchNumber = parseInt(req.body.matchNumber, 10);
//   const teamScouted = parseInt(req.body.teamScouted, 10);
//   try {
//     val = await dbHandler.fetchShotChartData(req.db, competitionID, matchNumber, teamScouted).catch((e) => { console.error(e); val.err_occur = true; });
//   } catch (err) {
//     console.error(err);
//     val.err_occur = true;
//   }
//   let resobj = null;
//   if (val.err_occur === false) {
//     resobj = {
//       success: true,
//       competition: competitionID,
//       matchNumber,
//       teamScouted,
//       data: val.data.data,
//     };
//   } else {
//     resobj = {
//       success: false,
//       reasons: val.err_reasons,
//     };
//   }
//   res.json(resobj);
// });
// app.post('/api/submitShotChartData', auth.checkAuth, async (req: any, res:any) => {
//   let val;
//   const scouter = { name: String(res.locals.name), id: String(res.locals.id) };
//   const competitionID = String(req.body.competitionID);
//   const matchNumber = parseInt(req.body.matchNumber, 10);
//   const teamScouted = parseInt(req.body.teamScouted, 10);
//   const { data } = req.body;
//   try {
//     val = await dbHandler.submitShotChartData(req.db, scouter, competitionID, matchNumber, teamScouted, data).catch((e) => { console.error(e); val.err_occur = true; });
//   } catch (err) {
//     console.error(err);
//     val.err_occur = true;
//   }
//   let resobj = null;
//   if (val.err_occur === false) {
//     resobj = {
//       success: true,
//       competition: competitionID,
//       matchNumber,
//     };
//   } else {
//     resobj = {
//       success: false,
//       reasons: val.err_reasons,
//     };
//   }
//   res.json(resobj);
// });
/**
 * POST route '/api/addAPIKey'
 * Allows the creation of API keys from current OAuth users.
 * @param token in form of header with title 'token' and value of JWT provided by Google OAuth
 * @returns back to the client let resobj (success, client id, and client secret generated) and HTTP Status Code 200 OK.
 */
app.post('/api/addAPIKey', auth.noAPIKey, auth.checkAuth, async (req: any, res:any) => {
  let val;
  const clientInfo = await uuidAPIKey.create();
  try {
    val = await dbHandler.addKey(req.db, clientInfo.uuid, clientInfo.apiKey).catch((e) => { console.error(e); val.err_occur = true; });
  } catch (err) {
    console.error(err);
    val.err_occur = true;
  }
  let resobj = null;
  if (val.err_occur === false) {
    resobj = {
      success: true,
      CLIENT_ID: clientInfo.uuid,
      CLIENT_SECRET: clientInfo.apiKey,
    };
  } else {
    resobj = {
      success: false,
      reasons: val.err_reasons,
    };
  }
  res.json(resobj);
});

app.post('/api/addScouterToMatch', auth.checkAuth, async (req: any, res:any) => {
  let val;
  const match = String(req.body.match);
  const user = parseInt(res.locals.id, 10);
  const teamScouted = parseInt(req.body.team_scouting, 10);
  const userName = String(res.locals.name);
  try {
    val = await dbHandler.addScouterToMatch(req.db, user, userName, match, teamScouted).catch((e) => { console.error(e); val.err_occur = true; });
  } catch (err) {
    console.error(err);
    val.err_occur = true;
  }
  let resobj = null;
  if (val.err_occur === false) {
    resobj = {
      success: true,
    };
  } else {
    resobj = {
      success: false,
      reasons: val.err_reasons,
    };
  }
  res.json(resobj);
});

app.post('/api/removeScouterFromMatch', auth.checkAuth, async (req: any, res:any) => {
  let val;
  const match = String(req.body.match);
  const user = parseInt(res.locals.id, 10);
  const teamScouted = parseInt(req.body.team_scouting, 10);
  try {
    val = await dbHandler.removeScouterFromMatch(req.db, user, match, teamScouted).catch((e) => { console.error(e); val.err_occur = true; });
  } catch (err) {
    console.error(err);
    val.err_occur = true;
  }
  let resobj = null;
  if (val.err_occur === false) {
    resobj = {
      success: true,
    };
  } else {
    resobj = {
      success: false,
      reasons: val.err_reasons,
    };
  }
  res.json(resobj);
});

app.post('/api/submitStrategy', auth.checkAuth, async (req: any, res:any) => {
  let val;
  const scouter = String(res.locals.name);
  const comp = String(req.body.competition);
  const data = String(req.body.data);
  let doGet = true;
  // Application exhibits unpredicatble behavior if `if` evaluates to true, so we just filter that out.
  if (data === 'null' || scouter === 'undefined') {
    doGet = false;
  }
  const match = String(req.body.match);
  let resobj = null;
  if (doGet === true) {
    try {
      val = await dbHandler.submitStrategy(req.db, scouter, match, comp, data);
    } catch (err) {
      console.error(err);
      val.err_occur = true;
    }
    if (val.err_occur === false) {
      resobj = {
        success: true,
      };
    } else {
      resobj = {
        success: false,
        reasons: val.err_reasons,
      };
    }
  } else {
    resobj = {
      success: false,
      reasons: 'Data is null',
    };
  }
  res.json(resobj);
});

app.get('/api/fetchStrategy', async (req: any, res:any) => {
  let val;
  const comp = String(req.query.competition);
  const match = String(req.query.match);

  try {
    val = await dbHandler.fetchStrategy(req.db, comp, match).catch((e) => { console.error(e); val.err_occur = true; });
  } catch (err) {
    console.error(err);
    val.err_occur = true;
  }
  // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
  let dataInterim;
  try {
    dataInterim = val.data;
  } catch (e) {
    val.err_occur = true;
  }
  let resobj = null;
  if (val.err_occur === false) {
    resobj = {
      success: true,
      data: dataInterim,
    };
  } else {
    resobj = {
      success: false,
      reasons: val.err_reasons,
    };
  }
  res.json(resobj);
});

app.get('/api/getUserStrategy', auth.checkAuth, async (req: any, res:any) => {
  let val;
  const comp = String(req.query.competition);
  const match = String(req.query.match_number);
  const name = String(res.locals.name);
  try {
    val = await dbHandler.getUserStrategy(req.db, comp, match, name).catch((e) => { console.error(e); val.err_occur = true; });
  } catch (err) {
    console.error(err);
    val.err_occur = true;
  }
  // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
  let dataInterim;
  try {
    dataInterim = val.data;
  } catch (e) {
    val.err_occur = true;
  }
  let resobj = null;
  if (val.err_occur === false) {
    resobj = {
      success: true,
      data: dataInterim,
    };
  } else {
    resobj = {
      success: false,
      reasons: val.err_reasons,
    };
  }
  res.json(resobj);
});

// Privacy Policy
app.get('/privacy-policy', (req: any, res:any) => {
  res.status(301).redirect('https://drive.google.com/a/imsa.edu/file/d/11_cAuaerCrQ3BBXNx_G_zw1ZyGaTWx0z/view?usp=sharing');
});


app.post('/api/submitPitData', auth.checkAuth, async (req: any, res:any) => {
  let val;
  const scouter = { name: String(res.locals.name), id: String(res.locals.id) };
  const competitionID = String(req.body.competitionID);
  const matchNumber = parseInt(req.body.matchNumber, 10);
  const teamScouted = parseInt(req.body.teamScouted, 10);
  const { data } = req.body;
  try {
    val = await dbHandler.submitPitData(req.db, scouter, competitionID, matchNumber, teamScouted, data).catch((e) => { console.error(e); val.err_occur = true; });
  } catch (err) {
    console.error(err);
    val.err_occur = true;
  }

  let resobj = null;
  if (val.err_occur === false) {
    resobj = {
      success: true,
      competition: competitionID,
      matchNumber,
    };
  } else {
    resobj = {
      success: false,
      reasons: val.err_reasons,
    };
  }
  res.json(resobj);
});

app.get('/api/fetchPitData', async (req: any, res:any) => {
  let val;
  const competitionID = String(req.query.competition);
  const matchNumber = parseInt(req.query.match_number, 10);
  const teamScouted = parseInt(req.query.team_scouted, 10);
  try {
    val = await dbHandler.fetchPitData(req.db, competitionID, matchNumber, teamScouted).catch((e) => { console.error(e); val.err_occur = true; });
  } catch (err) {
    console.error(err);
    val.err_occur = true;
  }
  // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
  let dataInterim;
  try {
    dataInterim = val.data.data;
  } catch (e) {
    val.err_occur = true;
  }
  let resobj = null;
  if (val.err_occur === false) {
    resobj = {
      success: true,
      competition: competitionID,
      matchNumber,
      teamScouted,
      data: dataInterim,
    };
  } else {
    resobj = {
      success: false,
      reasons: val.err_reasons,
    };
  }
  res.json(resobj);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
