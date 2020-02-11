let express = require("express")
let bodyParser = require("body-parser")
let validator = require('validator')
let dbHandler = require('./dbHandler.js')
let auth = require('./authHandler.js')
let expressMongoDb = require('express-mongo-db');
const port = process.env.PORT || 8090;

app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
let options = {
    keepAlive: 1, connectTimeoutMS: 30000
};
app.use(expressMongoDb('mongodb+srv://api-user-new:titanscout2022@2022-scouting-4vfuu.mongodb.net/test?retryWrites=true&w=majority', options))


app.get('/', (req, res) => {
    res.send("API live")
    res.status(200)
})

app.post("/api/addUserToTeam", auth.checkAuth, async (req, res) => {
    let err = false;
    const id = res.locals.id
    const name = res.locals.name
    const team = parseInt(validator.escape(req.body.team))
    val = dbHandler.addUserToTeam(req.db, id, name, team)
    resobj = {
        "success": !err,
        "name": res.locals.name,
        "id": res.locals.id,
        "team": req.body.team,
    }
    res.json(resobj)
})
app.get("/api/getCompetitions", auth.checkAuth, async (req, res) => {
    let err = false;
    const id = res.locals.id
    val = dbHandler.getCompetitions(req.db, id)
    resobj = {
            "success": !err,
            "id": res.locals.id,
            "team": val.team,
            "competitions": val.competitions
    }
    res.json(resobj)
})
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
            "success": false
        }
    }
    res.json(resobj)
})

app.get('/api/fetchMatches', async (req, res) => {  
    let val;  
    const competition = String(validator.escape(req.body.competition))
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
            "success": false
        }
    }
    res.json(resobj)
})

app.listen(port, () => console.log(`Listening on port ${port}`))