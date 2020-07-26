import UserReturnData from './UserReturnData';

module.exports = (app: any, dbHandler: any) => {
  app.get('/api/fetchMatchData', async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const competitionID = String(req.query.competition);
    const matchNumber = parseInt(req.query.match_number, 10);
    const teamScouted = parseInt(req.query.team_scouted, 10);
    if (!(competitionID && matchNumber && teamScouted)) {
      res.json({
        success: false,
        reasons: ['A required parameter (competition ID, match number, or team scouted) was not provided'],
      })
    }
    val.data = await dbHandler.fetchMatchData(req.db, competitionID, matchNumber, teamScouted).catch((e) => { console.error(e); val.err_occur = true; val.err_reasons.push(e); });
    // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
    let dataInterim;
    try {
      dataInterim = val.data.data;
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
};