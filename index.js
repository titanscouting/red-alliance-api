let express = require("express")
let bodyParser = require("body-parser")
let validator = require('validator')
let dbHandler = require('./dbHandler.js')
let methods = require('./utils/methods.js')
const port = 4000

app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.post("/api/send-name", (req, res) => {
    const name = String(validator.escape(req.body.name))
    const data = String(validator.escape(req.body.data))
    dbHandler.addName(name, data)
    res.send("Done")
})

app.post("/api/send-name-auth", methods.checkAuth, (req, res) => {
    const name = String(validator.escape(req.body.name))
    const data = String(validator.escape(req.body.data))
    dbHandler.addName(name, data)
    res.send("Done")
})


app.listen(port, () => console.log(`Listening on port ${port}`))