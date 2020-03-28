let express = require("express")
let bodyParser = require("body-parser")
let dbHandler = require('./dbHandler.js')
let auth = require('./authHandler.js')
let expressMongoDb = require('express-mongo-db');
const port = process.env.PORT || 8190;

app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
let options = {
    keepAlive: 1, connectTimeoutMS: 30000
};

// Make sure to set the connection string as an environment variable, e.g export REDALLIANCEDBKEY="fjsldjfksldfjaklfjsdalkfd"
app.use(expressMongoDb(process.env.REDALLIANCEDBKEY, options))
/** 
 * NOTE TO DEVELOPERS: the `auth.checkAuth` statement is simply middleware which contacts authHandler.js to ensure that the user has a valid authentication token. 
 * Within the documentation, the token input for each authenticated route (routes which require authentication) will be referred to as @param token. 
*/

/**
 * GET route "/"
 * Base route; allows the frontend application and/or developer to sanity check to ensure the API is live.
 * @returns HTTP Status Code 200 OK
 */
app.get('/', (req, res) => {
    res.send("The Red Alliance API. Copyright 2020 Titan Scouting.")
    res.status(200)
})


/**
 * POST route "/api/submitMatchData"
 * Allows the application to submit data to the API, with some key data seperated within the JSON and the rest submitted as arbirtary structures within the data key.
 * @param token in form of header with title 'token' and value of JWT provided by Google OAuth
 * @param competition_id is the identifier for the competition: e.g. "2020ilch".
 * @param match_number is the number of the match scouted: e.g. "1".
 * @param team_scouted is the team that was being scouted: e.g. "3061".
 * @param data is the arbritrary other data that needs to be recorded for the match.
 * @returns back to the client resobj (success boolean, competition id, and match number) and HTTP Status Code 200 OK.
 */
app.post("/api/submitMatchData", auth.checkAuth, async (req, res) => {
    let val;
    const scouter = {name: String(res.locals.name), id: String(res.locals.id)}
    const competition_id = String(req.body.competition_id)
    const match_number = parseInt(req.body.match_number)
    const team_scouted = parseInt(req.body.team_scouted)
    const data = req.body.data
    try{
        val = await dbHandler.submitMatchData(req.db, scouter, competition_id, match_number, team_scouted, data).catch(e => {console.error(e); val.err_occur = true;})
    } catch (err) {
        console.error(err)
        val.err_occur = true;
    }
    if (val.err_occur == false) {
        resobj = {
            "success": true,
            "competition": competition_id,
            "match_number" : match_number,
        }
    } else {
        resobj = {
            "success": false,
            "reasons": val.err_reasons,
        }
    }
    res.json(resobj)
})

/**
 * GET route "/api/fetchMatches"
 * Allows the application to fetch the list of matches and the number of scouters for the match.
 * @param competition_id is the identifier for the competition: e.g. "2020ilch".
 * @returns back to the client resobj (competition, list of matches, andn number of scouters) and 200 OK.
 */
app.get('/api/fetchMatches', async (req, res) => {
    let val;
    const competition = String(req.query.competition)
    try{
        val = await dbHandler.fetchMatchesForCompetition(req.db, competition).catch(e => {console.error(e); val.err_occur = true;})
    } catch (err) {
        console.error(err)
        val.err_occur = true;
    }
    if (val.err_occur == false) {
        resobj = {
            "success": true,
            "competition": competition,
            "data": val.data.data
        }
    } else {
        resobj = {
            "success": false,
            "reasons": val.err_reasons,
        }
    }
    res.json(resobj)
})
/**
 * GET route "/api/checkUser"
 * Allows the application to fetch the list of matches and the number of scouters for the match.
 * @param token is the token obtained from Google OAuth and the JWT.
 * @returns back to the client resobj (name and Google ID of user) and HTTP Status Code 200 OK.
 */
app.get('/api/checkUser', auth.checkAuth, async (req, res) => {
    let val;
    try{
        val.name = res.locals.name; 
        val.id = res.locals.id
    } catch (err) {
        console.error(err)
        val.err_occur = true;
    }
    if (val.err_occur == false) {
        resobj = {
            "success": true,
            "name": val.name, 
            "id": val.id
        }
    } else {
        resobj = {
            "success": false,
            "reasons": val.err_reasons,
        }
    }
    res.json(resobj)
})
/**
 * GET route "/api/fetchScouterSuggestions"
 * Allows the application to fetch the suggestions that a scouter made for a match (presumably one that Titan Robotics is part of, or else why would they make suggestions?).
 * @param competition is the identifier for the competition: e.g. "2020ilch".
 * @param match_number is the number of the match scouted: e.g. "1".
 * @returns back to the client resobj (competition id, match number, and reccoemendation) and HTTP Status Code 200 OK.
 */
app.get('/api/fetchScouterSuggestions', async (req, res) => {
    let val;
    const competition = String(req.query.competition)
    const match_number = parseInt(req.query.match_number)

    try{
        val = await dbHandler.fetchScouterSuggestions(req.db, competition, match_number).catch(e => {console.error(e); val.err_occur = true;})
    } catch (err) {
        console.error(err)
        val.err_occur = true;
    }
    let data_interim;
    try {
        data_interim = val.data
    } catch (e) {
        val.err_occur = true;
    }
    if (val.err_occur == false) {
        resobj = {
            "success": true,
            "competition": competition,
            "match_number" : match_number,
            "data": data_interim
        }
    } else {
        resobj = {
            "success": false,
            "reasons": val.err_reasons,
        }
    }
    res.json(resobj)
})
/**
 * GET route "/api/fetchScouterUIDs"
 * Allows the application to fetch which users are scouting a given match. 
 * @param competition is the identifier for the competition: e.g. "2020ilch".
 * @param match_number is the number of the match scouted: e.g. "1".
 * @returns back to the client resobj (competition id, array containing scouter information, and corresponding index teams) and HTTP Status Code 200 OK.
 */
app.get("/api/fetchScouterUIDs", async (req, res) => {
  let val
  const competition = String(req.query.competition)
  const match_number = parseInt(req.query.match_number)
  try {
        val = await dbHandler.fetchScouterUIDs(req.db, competition, match_number).catch(e => {console.error(e); val.err_occur = true;})
  } catch (e) {
        console.error(e)
        val.err_occur = true
  }
  // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
  let scouters_interim
  let teams_interim
  try {
        scouters_interim = val.scouters
        teams_interim = val.teams
  } catch {
        val.err_occur = true
  }
  if (val.err_occur == false) {
      resobj = {
          "success": true,
          "competition": competition,
          "scouters": scouters_interim,
          "teams": teams_interim
      }
  } else {
      resobj = {
          "success": false,
          "reasons": val.err_reasons,
      }
  }
  res.json(resobj)
})
/**
 * GET route "/api/fetchAllTeamNicknamesAtCompetition"
 * Allows the application to fetch the nicknames for all the teams which are at a competition. (For example, Team 2022 = Titan Robotics) 
 * @param competition is the identifier for the competition: e.g. "2020ilch".
 * @returns back to the client resobj (competition id, JSON of the team number and nicknames) and HTTP Status Code 200 OK.
 */
app.get("/api/fetchAllTeamNicknamesAtCompetition", async (req, res) => {
  let val
  const competition = String(req.query.competition)
  try {
    val = await dbHandler.fetchAllTeamNicknamesAtCompetition(req.db, competition).catch(e => {console.error(e); val.err_occur = true;})
  } catch (e) {
      console.error(e)
      val.err_occur = true
  }
  if (val.err_occur == false) {
      resobj = {
          "success": true,
          "competition": competition,
          "data": val.data
      }
  } else {
      resobj = {
          "success": false,
          "reasons": val.err_reasons,
      }
  }
  res.json(resobj)
})
/**
 * GET route "/api/findTeamNickname"
 * Allows the application to get the nickname for a team, given the team number.
 * @param team_num is the FRC team number: e.g. "2022".
 * @returns back to the client resobj (team number and nickname) and HTTP Status Code 200 OK.
 */
app.get("/api/findTeamNickname", async (req, res) => {
  let val
  const team_num = String(req.query.team_number)
  try {
    val = await dbHandler.findTeamNickname(req.db, team_num).catch(e => {console.error(e); val.err_occur = true;})
  } catch (e) {
      console.error(e)
      val.err_occur = true
  }
  if (val.err_occur == false) {
      resobj = {
          "success": true,
          "team_num" : team_number,
          "nickname" : val.data
      }
  } else {
      resobj = {
          "success": false,
          "reasons": val.err_reasons,
      }
  }
  res.json(resobj)
})
/**
 * GET route "/api/fetchCompetitionSchedule"
 * Allows the application to get all the matches for a given competition.
 * @param competition is the Competition id: e.g. "2020ilch".
 * @returns back to the client resobj (competition and ) and HTTP Status Code 200 OK.
 */
app.get("/api/fetchCompetitionSchedule", async (req, res) => {
  let val
  const competition = String(req.query.competition)
  try {
    val = await dbHandler.fetchCompetitionSchedule(req.db, competition).catch(e => {console.error(e); val.err_occur = true;})
  } catch (e) {
      console.error(e)
      val.err_occur = true
  }
  if (val.err_occur == false) {
      resobj = {
          "success": true,
          "competition": competition,
          "data": val.data
      }
  } else {
      resobj = {
          "success": false,
          "reasons": val.err_reasons,
      }
  }
  res.json(resobj)
})
app.get("/api/fetch2022Schedule", async (req, res) => {
  let val
  const competition = String(req.query.competition)
  try {
    val = await dbHandler.fetch2022Schedule(req.db, competition).catch(e => {console.error(e); val.err_occur = true;})
  } catch (e) {
      console.error(e)
      val.err_occur = true
  }
  if (val.err_occur == false) {
      resobj = {
          "success": true,
          "competition": competition,
          "data": val.data
      }
  } else {
      resobj = {
          "success": false,
          "reasons": val.err_reasons,
      }
  }
  res.json(resobj)
})

app.get('/api/fetchMatchData', async (req, res) => {
    let val;
    const competition_id = String(req.query.competition)
    const match_number = parseInt(req.query.match_number)
    const team_scouted = parseInt(req.query.team_scouted)
    try {
        val = await dbHandler.fetchMatchData(req.db, competition_id, match_number, team_scouted).catch(e => {console.error(e); val.err_occur = true;})
    } catch (err) {
        console.error(err)
        val.err_occur = true;
    }
    // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
    let data_interim
    try {
        data_interim = val.data.data;
    } catch {
        val.err_occur = true;
    }
    if (val.err_occur == false) {

        resobj = {
            "success": true,
            "competition": competition_id,
            "match_number": match_number,
            "team_scouted": team_scouted,
            "data": data_interim
        }
    } else {
        resobj = {
            "success": false,
            "reasons": val.err_reasons,
        }
    }
    res.json(resobj)
})

app.get('/api/fetchShotChartData', async (req, res) => {
    let val;
    const competition_id = String(req.body.competition_id)
    const match_number = parseInt(req.body.match_number)
    const team_scouted = parseInt(req.body.team_scouted)
    try {
        val = await dbHandler.fetchShotChartData(req.db, competition_id, match_number, team_scouted).catch(e => {console.error(e); val.err_occur = true;})
    } catch (err) {
        console.error(err)
        val.err_occur = true;
    }
    if (val.err_occur == false) {
        resobj = {
            "success": true,
            "competition": competition_id,
            "match_number": match_number,
            "team_scouted": team_scouted,
            "data": val.data.data
        }
    } else {
        resobj = {
            "success": false,
            "reasons": val.err_reasons,
        }
    }
    res.json(resobj)
})
app.post("/api/submitShotChartData", auth.checkAuth, async (req, res) => {
    let val;
    const scouter = {name: String(res.locals.name), id: String(res.locals.id)}
    const competition_id = String(req.body.competition_id)
    const match_number = parseInt(req.body.match_number)
    const team_scouted = parseInt(req.body.team_scouted)
    const data = req.body.data
    try{
        val = await dbHandler.submitShotChartData(req.db, scouter, competition_id, match_number, team_scouted, data).catch(e => {console.error(e); val.err_occur = true;})
    } catch (err) {
        console.error(err)
        val.err_occur = true;
    }
    if (val.err_occur == false) {
        resobj = {
            "success": true,
            "competition": competition_id,
            "match_number" : match_number,
        }
    } else {
        resobj = {
            "success": false,
            "reasons": val.err_reasons,
        }
    }
    res.json(resobj)
})

app.post('/api/addScouterToMatch', auth.checkAuth, async (req, res) => {
    let val;
    const match = String(req.body.match)
    const user = parseInt(res.locals.id)
    const team_scouted = parseInt(req.body.team_scouting)
    const user_name = String(res.locals.name)
    try {
        val = await dbHandler.addScouterToMatch(req.db, user, user_name, match, team_scouted).catch(e => {console.error(e); val.err_occur = true;})
    } catch (err) {
        console.error(err)
        val.err_occur = true;
    }
    if (val.err_occur == false) {
        resobj = {
            "success": true,
        }
    } else {
        resobj = {
            "success": false,
            "reasons": val.err_reasons,
        }
    }
    res.json(resobj)
})

app.post('/api/removeScouterFromMatch', auth.checkAuth, async (req, res) => {
    let val;
    const match = String(req.body.match)
    const user = parseInt(res.locals.id)
    const team_scouted = parseInt(req.body.team_scouting)
    try {
        val = await dbHandler.removeScouterFromMatch(req.db, user, match, team_scouted).catch(e => {console.error(e); val.err_occur = true;})
    } catch (err) {
        console.error(err)
        val.err_occur = true;
    }
    if (val.err_occur == false) {
        resobj = {
            "success": true,
        }
    } else {
        resobj = {
            "success": false,
            "reasons": val.err_reasons,
        }
    }
    res.json(resobj)
})

app.get('/api/getDataOnTeam', auth.checkAuth, async (req, res) => {
    let val;
    const team = parseInt(req.query.team)
    const comp = String(req.query.competition)
    try {
        val = await dbHandler.getDataOnTeam(req.db, team, comp).catch(e => {console.error(e); val.err_occur = true;})
    } catch (err) {
        console.error(err)
        val.err_occur = true;
    }
    if (val.err_occur == false) {
        resobj = {
            "success": true,
            "data": val.data
        }
    } else {
        resobj = {
            "success": false,
            "reasons": val.err_reasons,
        }
    }
    res.json(resobj)
})

app.post('/api/submitStrategy', auth.checkAuth, async (req, res) => {
    let val;
    const scouter = String(res.locals.name);
    const comp = String(req.body.competition)
    const data = String(req.body.data)
    var do_get = true
    // Application exhibits unpredicatble behavior if `if` evaluates to true, so we just filter that out. 
    if (data == 'null' || scouter == 'undefined') {
        do_get = false; 
    }
    const match = String(req.body.match)
    if (do_get == true) {
        try {
            val = await dbHandler.submitStrategy(req.db, scouter, match, comp, data)
        } catch (err) {
            console.error(err)
            val.err_occur = true;
        }
        if (val.err_occur == false) {
            resobj = {
                "success": true,
            }
        } else {
            resobj = {
                "success": false,
                "reasons": val.err_reasons,
            }
        }
        
    } else {
        resobj = {
            "success": false,
            "reasons": "Data is null"
        }
    }

    res.json(resobj)
})

app.get('/api/fetchStrategy', async (req, res) => {
    let val;
    const comp = String(req.query.competition)
    const match = String(req.query.match)

    try {
        val = await dbHandler.fetchStrategy(req.db, comp, match).catch(e => {console.error(e); val.err_occur = true;})
    } catch (err) {
        console.error(err)
        val.err_occur = true;
    }
    // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
    let data_interim
    try {
        data_interim = val.data;
    } catch {
        val.err_occur = true;
    }
    if (val.err_occur == false) {
        resobj = {
            "success": true,
            "data": data_interim
        }
    } else {
        resobj = {
            "success": false,
            "reasons": val.err_reasons,
        }
    }
    res.json(resobj)
})

app.get('/api/getNumberScouts', async (req, res) => {
    let val;
    const comp = String(req.query.competition)
    try {
        val = await dbHandler.getNumberScouts(req.db, comp).catch(e => {console.error(e); val.err_occur = true;})
    } catch (err) {
        console.error(err)
        val.err_occur = true;
    }
    // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
    let data_interim
    try {
        data_interim = val.data;
    } catch {
        val.err_occur = true;
    }
    if (val.err_occur == false) {
        resobj = {
            "success": true,
            "data": data_interim
        }
    } else {
        resobj = {
            "success": false,
            "reasons": val.err_reasons,
        }
    }
    res.json(resobj)
})

app.get('/api/getUserStrategy', auth.checkAuth, async (req, res) => {
    let val;
    const comp = String(req.query.competition)
    const match = String(req.query.match_number)
    const name = String(res.locals.name)
    try {
        val = await dbHandler.getUserStrategy(req.db, comp, match, name).catch(e => {console.error(e); val.err_occur = true;})
    } catch (err) {
        console.error(err)
        val.err_occur = true;
    }
    // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
    let data_interim
    try {
        data_interim = val.data;
    } catch {
        val.err_occur = true;
    }
    if (val.err_occur == false) {
        resobj = {
            "success": true,
            "data": data_interim
        }
    } else {
        resobj = {
            "success": false,
            "reasons": val.err_reasons,
        }
    }
    res.json(resobj)
})

// Privacy Policy
app.get('/privacy-policy', function(req, res) {
    res.redirect('https://drive.google.com/a/imsa.edu/file/d/11_cAuaerCrQ3BBXNx_G_zw1ZyGaTWx0z/view?usp=sharing')
})

app.get('/api/fetchMatchConfig', async (req, res) => {
    let response = [
        {
            "Auto":[
                {
                    "name":"Passed Auto Line?",
                    "key":"pass-line",
                    "widget":"segment",
                    "options":["Don't Know","No","Yes"]
                },
                {
                    "name":"Initial Balls Stored",
                    "key":"balls-started",
                    "widget":"stepper"
                },
                {
                    "name":"Extra Balls Collected",
                    "key":"balls-collected",
                    "widget":"stepper"
                },
                {
                    "name":"Balls Scored Upper",
                    "key":"balls-upper-auto",
                    "widget":"stepper"
                },
                {
                    "name":"Balls Scored Lower",
                    "key":"balls-lower-auto",
                    "widget":"stepper"
                }
            ]
        },
        {
            "Teleop":[
                {
                    "name":"Spun Wheel?",
                    "key":"spun-wheel",
                    "widget":"segment",
                    "options":["Don't know","No","Position","Color"]
                },
                {
                    "name":"Balls Scored Upper",
                    "key":"balls-upper-teleop",
                    "widget":"stepper"
                },
                {
                    "name":"Balls Scored Lower",
                    "key":"balls-lower-teleop",
                    "widget":"stepper"
                },
                {
                    "name":"Did they shoot from a vulnerable location??",
                    "key":"shooting-vulnerable",
                    "widget":"segment",
                    "options":["Don't know","No","Yes"]
                },
                {
                    "name":"Where could they shoot from?",
                    "key":"shooting-notes",
                    "widget":"text-area"
                },
                {
                    "name":"Did they climb?",
                    "key":"climb",
                    "widget":"segment",
                    "options":["Don't know", "No Attempt", "Failed", "Yes"]
                },
                {
                    "name":"Did they play defense?",
                    "key":"defense",
                    "widget":"segment",
                    "options":["Don't know","No","Yes"]
                },
                {
                    "name":"What teams did this one play defense on?",
                    "key":"defense-notes",
                    "widget":"text-area"
                }
            ]
        },
        {
            "Notes":[
                {
                    "name":"Overall Competency",
                    "key":"competency",
                    "widget":"segment",
                    "options":["Don't know","Awful","Meh","Good","Best"]
                },
                {
                    "name":"Speed",
                    "key":"speed",
                    "widget":"segment",
                    "options":["Don't know","Slow","Med.","Fast","Ludicrous"]
                },
                {
                    "name":"Strategic Focus",
                    "key":"strategic-focus",
                    "widget":"segment",
                    "options":["Don't know","Offense","Defense","Hybrid"]
                },
                {
                    "name":"How could we use this robot in a strategy?",
                    "key":"strategy-notes",
                    "widget":"text-area"
                }
            ]
        }
    ];
    res.json(response)
})

app.get('/api/fetchPitConfig', async (req, res) => {
    let response = [
        {
            "Pit":[
                {
                    "name":"Updated on Match",
                    "key":"match-updated",
                    "widget":"stepper"
                },
                {
                    "name":"Can do low balls?",
                    "key":"low-balls",
                    "widget":"segment",
                    "options":["Don't Know", "Yes", "No"]
                },
                {
                    "name":"Can do high balls?",
                    "key":"high-balls",
                    "widget":"segment",
                    "options":["Don't Know", "Yes", "No"]
                },
                {
                    "name":"Has wheel mechanism?",
                    "key":"wheel-mechanism",
                    "widget":"segment",
                    "options":["Don't Know", "Yes", "No"]
                },
                {
                    "name":"Demonstrated wheel success?",
                    "key":"wheel-success",
                    "widget":"segment",
                    "options":["Don't Know", "Yes", "No"]
                },
                {
                    "name":"Strategic focus",
                    "key":"strategic-focus",
                    "widget":"segment",
                    "options":["idk","Offense","Defense","Hybrid"]
                },
                {
                    "name":"Climb mechanism",
                    "key":"climb-mechanism",
                    "widget":"segment",
                    "options":["Don't Know", "x0", "x1", "x2", "x3"]

                },
                {
                    "name":"Climb requirements (space? time?)",
                    "key":"climb-requirements",
                    "widget":"text-area"
                },
                {
                    "name":"Attitude toward Titan Robotics",
                    "key":"attitude",
                    "widget":"segment",
                    "options":["Don't Know", "Negative", "Neutral", "Positive", "Love"]

                },
                {
                    "name":"Other notes",
                    "key":"defense-notes",
                    "widget":"text-area"
                }
            ]
        }
    ];
    res.json(response)
})

app.post("/api/submitPitData", auth.checkAuth, async (req, res) => {
    let val;
    const scouter = {name: String(res.locals.name), id: String(res.locals.id)}
    const competition_id = String(req.body.competition_id)
    const match_number = parseInt(req.body.match_number)
    const team_scouted = parseInt(req.body.team_scouted)
    const data = req.body.data
    try{
        val = await dbHandler.submitPitData(req.db, scouter, competition_id, match_number, team_scouted, data).catch(e => {console.error(e); val.err_occur = true;})
    } catch (err) {
        console.error(err)
        val.err_occur = true;
    }

    if (val.err_occur == false) {
        resobj = {
            "success": true,
            "competition": competition_id,
            "match_number" : match_number,
        }
    } else {
        resobj = {
            "success": false,
            "reasons": val.err_reasons,
        }
    }
    res.json(resobj)
})

app.get('/api/fetchPitData', async (req, res) => {
    let val;
    const competition_id = String(req.query.competition)
    const match_number = parseInt(req.query.match_number)
    const team_scouted = parseInt(req.query.team_scouted)
    try {
        val = await dbHandler.fetchPitData(req.db, competition_id, match_number, team_scouted).catch(e => {console.error(e); val.err_occur = true;})
    } catch (err) {
        console.error(err)
        val.err_occur = true;
    }
    // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
    let data_interim
    try {
        data_interim = val.data.data;
    } catch {
        val.err_occur = true;
    }
    if (val.err_occur == false) {
        resobj = {
            "success": true,
            "competition": competition_id,
            "match_number": match_number,
            "team_scouted": team_scouted,
            "data": data_interim
        }
    } else {
        resobj = {
            "success": false,
            "reasons": val.err_reasons,
        }
    }
    res.json(resobj)
})

app.listen(port, () => console.log(`Listening on port ${port}`))
