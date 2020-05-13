
// // This file just has all of the stuff for next year that we're not doing this year.
// /**
//  * POST route "/api/addUserToTeam"
//  * Not implemented and will not be implemented until next year
//  * Adds user to the team. More useful for next year's version of the application, this year the application is hard coded and will just use match ID data.
//  * @param token in form of header with title 'token' and value of JWT provided by Google OAuth
//  * @returns back to the client resobj and 200 OK.
// */
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
// /*
// * GET route "/api/getCompetitions"
// * Not implemented and will not be implemented until next year.
// */
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
