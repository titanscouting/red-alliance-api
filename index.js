let express = require("express")
let bodyParser = require("body-parser")
let validator = require('validator')
let dbHandler = require('./dbHandler.js')
let auth = require('./authHandler.js')
let expressMongoDb = require('express-mongo-db');
const port = 4000

app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressMongoDb('mongodb+srv://api_user:epycepoch2019@2022-scouting-4vfuu.mongodb.net/test?retryWrites=true&w=majority', { server: { socketOptions: { connectTimeoutMS: 5000 }}}));


app.get('/', (req, res) => {
    res.send("API live")
    res.status(200)
})

app.post("/api/addUserToTeam", auth.checkAuth, (req, res) => {
    let err = false;
    try{
        const id = res.locals.id
        const team = parseInt(validator.escape(req.body.team))
        const position = String(validator.escape(req.body.position))
        val = dbHandler.addUserToTeam(req.db, id, team, position)
        resobj = {}
        if (val != 0)
        {
            throw new Error('Error adding to DB')
        }
        } catch (error) {
            err = true; 
            resobj = {"success": !err}
            console.log(error)
        }
        if (err == false) { // do not change this line to a boolean operator, random JS errors can cause it to work unexpectedly (because JS). 
            resobj = {
                "success": !err,
                "id": res.locals.id,
                "team": req.body.team,
                "position": req.body.position
            }
        }
        res.json(resobj)
})
app.post("/api/getCompetitions", auth.checkAuth, (req, res) => {
    let err = false;
    try{
        const id = res.locals.id
        val = dbHandler.getCompetitions(req.db, id)
        resobj = {}
        if (!val)
        {
            throw new Error('Error fetching from DB')
        }
        } catch (error) {
            err = true; 
            resobj = {"success": !err}
            console.log(error)
        }
        if (err == false) { // do not change this line to a boolean operator, random JS errors can cause it to work unexpectedly (because JS). 
            resobj = {
                "success": !err,
                "id": res.locals.id,
                "team": val.team,
                "competitions": val.competitions
            }
        }
        res.json(resobj)
})
app.post("/api/submitMatchData", auth.checkAuth, (req, res) => {
    let err = false;
    try{
        const id = res.locals.id
        const competition_id = String(validator.escape(req.body.competition_id))
        const match_number = parseInt(validator.escape(req.body.match_number))
        const team_scouted = parseInt(validator.escape(req.body.team_scouted))
        const data = req.body.data
        val = dbHandler.addUserToTeam(id, competition_id, match_number, team_scouted, data)
        resobj = {}
        if (val != 0)
        {
            throw new Error('Error adding to DB')
        }
        } catch (error) {
            err = true; 
            resobj = {"success": !err}
            console.log(error)
        }
        if (err == false) { // do not change this line to a boolean operator, random JS errors can cause it to work unexpectedly (because JS). 
            resobj = {
                "success": !err
            }
        }
        res.json(resobj)
})
app.listen(port, () => console.log(`Listening on port ${port}`))