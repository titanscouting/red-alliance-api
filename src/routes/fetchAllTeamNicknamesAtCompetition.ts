import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

/**
 * GET route '/api/fetchAllTeamNicknamesAtCompetition'
 * Allows the application to fetch the nicknames for all the teams which are at a competition. (For example, Team 2022 = Titan Robotics)
 * @param competition is the identifier for the competition: e.g. '2020ilch'.
 * @returns back to the client let resobj (competition id, JSON of the team number and nicknames) and HTTP Status Code 200 OK.
 */
module.exports = (app, dbHandler) => {
  app.get('/api/fetchAllTeamNicknamesAtCompetition', async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const competition = String(req.query.competition);
    if (!(competition)) {
      val.err_occur = true;
      val.err_reasons.push('A required parameter (competition ID) was not provided');
    }
    val.data = await dbHandler.fetchAllTeamNicknamesAtCompetition(req.db, competition).catch((e) => { console.error(e); val.err_occur = true; });
    if (val.err_occur === false) {
      res.json({
        success: true,
        competition,
        data: val.data.data,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
