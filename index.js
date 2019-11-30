let express = require("express")
let bodyParser = require("body-parser")
let validator = require('validator')
let dbHandler = require('./dbHandler.js')
let auth = require('./authHandler.js')
const port = 4000

app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send("API live")
    res.status(200)
})

app.post("/api/addUser", auth.checkAuth, (req, res) => {
    try {
        const id = res.locals.id
        const name = String(validator.escape(req.body.name))
        val = dbHandler.addUser(id, name)
        if (val != 0)
        {
            throw new Error('Error adding to DB')
        }
    } catch (error) {
        res.json({
            "success": "false"
        })       
    }
    res.json({
        "success": "true",
        "id": res.locals.id,
        "name": req.body.name
    })
})

app.post("/api/addUserToTeam", auth.checkAuth, (req, res) => {
    try{
        const id = res.locals.id
        const team = parseInt(validator.escape(req.body.team))
        const position = String(validator.escape(req.body.position))
        val = dbHandler.addUserToTeam(id, team, position)
        if (val != 0)
        {
            throw new Error('Error adding to DB')
        }
    } catch (error) {
        res.json({
            "success": "false",
        })       
        console.log(error)
    }
    res.json({
        "success": "true",
        "id": res.locals.id,
        "team": req.body.team,
        "position": req.body.position
    })
})
app.listen(port, () => console.log(`Listening on port ${port}`))