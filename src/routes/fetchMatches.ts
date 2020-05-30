import UserReturnData from './UserReturnData'

/**
 * GET route '/api/fetchMatches'
 * Allows the application to fetch the list of matches and the number of scouters for the match.
 * @param competitionID is the identifier for the competition: e.g. '2020ilch'.
 * @returns back to the client resobj (competition, list of matches, andn number of scouters) and 200 OK.
 */
module.exports = (app: any, dbHandler: any) => {
    app.get('/api/fetchMatches', async (req: any, res:any) => {
        let val: UserReturnData = new UserReturnData();
        const competition = String(req.query.competition);
        try {
            val.data = await dbHandler.fetchMatchesForCompetition(req.db, competition).catch((e) => { console.error(e); val.err_occur = true; });
        } catch (err) {
            console.error(err);
            val.err_occur = true;
        }
        let resobj = null;
        if (val.err_occur === false) {
        resobj = {
            success: true,
            competition,
            data: val.data.data.data, // TODO: Fix that structure up a bit
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