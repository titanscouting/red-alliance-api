import UserReturnData from './UserReturnData';
import StatusCodes from './StatusCodes';
/**
 * GET route '/api/findTeamNickname'
 * Allows the application to get the nickname for a team, given the team number.
 * @param teamNum is the FRC team number: e.g. '2022'.
 * @returns back to the client let resobj (team number and nickname) and HTTP Status Code 200 OK.
*/

module.exports = (app: any, dbHandler: any) => {
  app.get('/api/findTeamNickname', async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const { competition } = req.query;
    const teamNumber = req.query.team_number;
    if (!(competition && teamNumber)) {
      res.status(StatusCodes.not_enough_info).json({
        success: false,
        reasons: ['A required parameter (competition ID or match number) was not provided'],
      })
    }
    const interim = await dbHandler.fetchAllTeamNicknamesAtCompetition(req.db, competition).catch((e) => { console.error(e); val.err_occur = true; });
    val.data = { team_nickname: interim.data[teamNumber] };
    if (val.err_occur === false) {
      res.json({
        success: true,
        competition,
        data: val.data,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
