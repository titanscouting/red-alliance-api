/**
 * POST route '/api/submitMatchData'
 * Allows the application to submit data to the API, with some key data seperated within the
 * JSON and the rest submitted as arbirtary structures within the data key.
 * @param token in form of header with title 'token' and value of JWT provided by Google OAuth
 * @param competitionID is the identifier for the competition: e.g. '2020ilch'.
 * @param matchNumber is the number of the match scouted: e.g. '1'.
 * @param teamScouted is the team that was being scouted: e.g. '3061'.
 * @param data is the arbritrary other data that needs to be recorded for the match.
 * @returns back to the client resobj (success boolean, competition id, and match number)
 * and HTTP Status Code 200 OK.
 */

module.exports = (app: any, dbHandler: any, auth: any) => {
    app.post('/api/submitMatchData', auth.checkAuth, async (req: any, res: any) => {
        let val;
        const scouter = { name: String(res.locals.name), id: String(res.locals.id) };
        const competitionID = String(req.body.competitionID);
        const matchNumber = parseInt(req.body.matchNumber, 10);
        const teamScouted = parseInt(req.body.teamScouted, 10);
        const { data } = req.body;
        try {
          val = await dbHandler.submitMatchData(req.db, scouter,
            competitionID, matchNumber, teamScouted, data).catch(
            (e) => {
              console.error(e); val.err_occur = true;
            },
          );
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
}
