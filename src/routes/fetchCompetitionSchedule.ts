import UserReturnData from './UserReturnData';
/**
 * GET route '/api/fetchCompetitionSchedule'
 * Allows the application to get all the matches for a given competition.
 * @param competition is the Competition id: e.g. '2020ilch'.
 * @returns back to the client let resobj (competition and ) and HTTP Status Code 200 OK.
 */
module.exports = (app: any, dbHandler: any) => {
  app.get('/api/fetchCompetitionSchedule', async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const competition = String(req.query.competition);
    val.data = await dbHandler.fetchCompetitionSchedule(req.db, competition).catch((e) => { console.error(e); val.err_occur = true; return {}; });
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
};
