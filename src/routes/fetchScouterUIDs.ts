/**
 * GET route '/api/fetchScouterUIDs'
 * Allows the application to fetch which users are scouting a given match.
 * @param competition is the identifier for the competition: e.g. '2020ilch'.
 * @param matchNumber is the number of the match scouted: e.g. '1'.
 * @returns back to the client let resobj (competition id, array containing scouter information, and corresponding index teams) and HTTP Status Code 200 OK.
*/

module.exports = (app: any, dbHandler: any) => {
    app.get('/api/fetchScouterUIDs', async (req: any, res:any) => {
        let val;
        const competition = String(req.query.competition);
        const matchNumber = parseInt(req.query.match_number, 10);
        try {
        val = await dbHandler.fetchScouterUIDs(req.db, competition, matchNumber).catch((e) => { console.error(e); val.err_occur = true; });
        } catch (e) {
        console.error(e);
        val.err_occur = true;
        }
        // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
        let scoutersInterim;
        let teamsInterim;
        try {
        scoutersInterim = val.scouters;
        teamsInterim = val.teams;
        } catch (e) {
        val.err_occur = true;
        }
        let resobj = null;
        if (val.err_occur === false) {
        resobj = {
            success: true,
            competition,
            scouters: scoutersInterim,
            teams: teamsInterim,
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