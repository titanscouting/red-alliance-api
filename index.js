let express = require("express")
let bodyParser = require("body-parser")
let validator = require('validator')
let dbHandler = require('./dbHandler.js')
let methods = require('./utils/methods.js')
const port = 4000

app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send("API live")
})

app.post("/api/addUser", methods.checkAuth, (req, res) => {
    try {
        const id = String(validator.escape(req.body.id))
        const name = String(validator.escape(req.body.name))
        dbHandler.addName(id, name)
    } catch (error) {
        res.send("Failed: Don't try writing to a teapot")
        res.status(418)
    }
    res.send("Sucess")

})


app.listen(port, () => console.log(`Listening on port ${port}`))