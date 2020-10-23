import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

/**
  * POST route "/api/addUserToTeam"
  * Adds user to a team.
  * @param token in form of header with title 'token' and value of JWT provided by Google OAuth
  * @returns back to the client resobj and 200 OK.
 */
module.exports = (app: any, dbHandler: any, auth: any) => {
  app.post('/api/addUserToTeam', auth.checkAuth, async (req, res) => {
    const val: UserReturnData = new UserReturnData();
    const team = parseInt(req.body.team, 10)
    if (!(team)) {
      val.err_occur = true;
      val.err_reasons.push('A required parameter (team) was not provided')
    }
    val.data = await dbHandler.addUserToTeam(req.db, res.locals.id, res.locals.name, team).catch((e) => { console.error(e); val.err_occur = true; });
    if (val.err_occur) {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    } else {
      res.json({
        success: true,
        name: res.locals.name,
        id: res.locals.id,
        team: req.body.team,
      })
    }
  })
};
