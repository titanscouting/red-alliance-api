let express = require("express")
let bodyParser = require("body-parser")
let validator = require('validator')
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
app.use(expressMongoDb('mongodb+srv://api-user-new:titanscout2022@2022-scouting-4vfuu.mongodb.net/test?retryWrites=true&w=majority', options))

/**
 * Base route; allows the frontend application and/or developer to sanity check to ensure the API is live.
 */
app.get('/', (req, res) => {
    res.send("The Red Alliance API. Copyright 2020 Titan Scouting.")
    res.status(200)
})

/**
 * POST route "/api/addUserToTeam"
 * Not implemented and will not be implemented until next year
 * Adds user to the team. More useful for next year's version of the application, this year the application is hard coded and will just use match ID data. 
 * @param token in form of header with title 'token' and value of JWT provided by Google OAuth
 * @returns back to the client resobj and 200 OK. 
*/
// app.post("/api/addUserToTeam", auth.checkAuth, async (req, res) => {
//     let err = false;
//     const id = res.locals.id
//     const name = res.locals.name
//     const team = parseInt(validator.escape(req.body.team))
//     val = dbHandler.addUserToTeam(req.db, id, name, team)
//     resobj = {
//         "success": !err,
//         "name": res.locals.name,
//         "id": res.locals.id,
//         "team": req.body.team,
//     }
//     res.json(resobj)
// })
/*
* GET route "/api/getCompetitions"
* Not implemented and will not be implemented until next year. 
*/
// app.get("/api/getCompetitions", auth.checkAuth, async (req, res) => {
//     let err = false;
//     const id = res.locals.id
//     val = dbHandler.getCompetitions(req.db, id)
//     resobj = {
//             "success": !err,
//             "id": res.locals.id,
//             "team": val.team,
//             "competitions": val.competitions
//     }
//     res.json(resobj)
// })

/**
 * POST route "/api/submitMatchData"
 * Allows the application to submit data to the API, with some key data seperated within the JSON and the rest submitted as arbirtary structures within the data key. 
 * @param token in form of header with title 'token' and value of JWT provided by Google OAuth
 * @param competition_id is the identifier for the competition: e.g. "Central 2020". 
 * @param match_number is the number of the match scouted: e.g. "1".
 * @param team_scouted is the team that was being scouted: e.g. "3061".
 * @param data is the arbritrary other data that needs to be recorded for the match.
 * @returns back to the client resobj and 200 OK. 
 */
app.post("/api/submitMatchData", auth.checkAuth, async (req, res) => {
    let val;  
    const id = res.locals.id
    const competition_id = String(validator.escape(req.body.competition_id))
    const match_number = parseInt(validator.escape(req.body.match_number))
    const team_scouted = parseInt(validator.escape(req.body.team_scouted))
    const data = req.body.data
    try{
        val = await dbHandler.submitMatchData(req.db, id, competition_id, match_number, team_scouted, data).catch(e => {console.error(e); val.err_occur = true;})
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
 * @param competition_id is the identifier for the competition: e.g. "Central 2020". 
 * @returns back to the client resobj and 200 OK. 
 */
app.get('/api/fetchMatches', async (req, res) => {  
    let val;  
    const competition = String(validator.escape(req.query.competition))
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
app.get('/api/fetchMatchData', async (req, res) => {  
    let val;  
    const competition_id = String(validator.escape(req.query.competition))
    const match_number = parseInt(validator.escape(req.query.match_number))
    const team_scouted = parseInt(validator.escape(req.query.team_scouted))    
    try {
        val = await dbHandler.fetchMatchData(req.db, competition_id, match_number, team_scouted).catch(e => {console.error(e); val.err_occur = true;})
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

app.get('/api/fetchShotChartData', async (req, res) => {  
    let val;  
    const competition_id = String(validator.escape(req.body.competition_id))
    const match_number = parseInt(validator.escape(req.body.match_number))
    const team_scouted = parseInt(validator.escape(req.body.team_scouted))    
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
            "data": val.dat.data
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
    const id = res.locals.id
    const competition_id = String(validator.escape(req.body.competition_id))
    const match_number = parseInt(validator.escape(req.body.match_number))
    const team_scouted = parseInt(validator.escape(req.body.team_scouted))
    const data = req.body.data
    try{
        val = await dbHandler.submitShotChartData(req.db, id, competition_id, match_number, team_scouted, data).catch(e => {console.error(e); val.err_occur = true;})
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

app.listen(port, () => console.log(`Listening on port ${port}`))