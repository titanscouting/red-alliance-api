/**
 * GET route '/api/fetchMatches'
 * Allows the application to fetch the list of matches and the number of scouters for the match.
 * @param competitionID is the identifier for the competition: e.g. '2020ilch'.
 * @returns back to the client resobj (competition, list of matches, andn number of scouters) and 200 OK.
 */
module.exports = (app: any, dbHandler: any) => {
    app.get('/api/fetchMatches', async (req: any, res:any) => {
        let val;
        const competition = String(req.query.competition);
        try {
        val = await dbHandler.fetchMatchesForCompetition(req.db, competition).catch((e) => { console.error(e); val.err_occur = true; });
        } catch (err) {
        console.error(err);
        val.err_occur = true;
        }
        let resobj = null;
        if (val.err_occur === false) {
        resobj = {
            success: true,
            competition,
            data: val.data.data,
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