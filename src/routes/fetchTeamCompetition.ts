import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';
/**
 * GET route '/api/fetchTeamCompetition'
 * Allows the application to get the current competition a team is attending.
 * @param teamNum is the FRC team number: e.g. '2022'.
 * @returns back to the client let resobj (competition ID) and HTTP Status Code 200 OK.
*/

module.exports = (app: any, dbHandler: any, auth: any) => {
  app.get('/api/fetchTeamCompetition', auth.checkAuth, async (req: any, res:any) => {
    let val: UserReturnData = new UserReturnData();
    const team: string = res.locals.team.toString();
    val = await dbHandler.fetchTeamCompetition(req.db, team.toString()).catch((e) => { console.error(e); val.err_occur = true; });
    if (val.err_occur === false) {
      res.json({
        success: true,
        team,
        competition: val.data,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
