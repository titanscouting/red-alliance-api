import UserReturnData from './UserReturnData'

module.exports = (app: any, dbHandler: any) => {
    app.get('/api/fetchPitData', async (req: any, res:any) => {
        let val: UserReturnData = new UserReturnData();
        const competitionID = String(req.query.competition);
        const matchNumber = parseInt(req.query.match_number, 10);
        const teamScouted = parseInt(req.query.team_scouted, 10);
        try {
          val.data = await dbHandler.fetchPitData(req.db, competitionID, matchNumber, teamScouted).catch((e) => { console.error(e); val.err_occur = true; });
        } catch (err) {
          console.error(err);
          val.err_occur = true;
        }
        // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
        let dataInterim: object;
        try {
          dataInterim = val.data.data.data;
        } catch (e) {
          val.err_occur = true;
        }
        let resobj = null;
        if (val.err_occur === false) {
          resobj = {
            success: true,
            competition: competitionID,
            matchNumber,
            teamScouted,
            data: dataInterim,
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
