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

/**
 * SHOT CHART STUFF (deemed unneccesary, unknown if functioning)
 */

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
