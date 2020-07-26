import UserReturnData from './UserReturnData';
import StatusCodes from './StatusCodes';

/**
  * POST route "/api/addUserToTeam"
  * Adds user to a team.
  * @param token in form of header with title 'token' and value of JWT provided by Google OAuth
  * @returns back to the client resobj and 200 OK.
 */
module.exports = (app: any, dbHandler: any, auth: any) => {
  app.post('/api/addUserToTeam', auth.checkAuth, async (req, res) => {
    const team = parseInt(req.body.team, 10)
    let err_occur;
    const returns: UserReturnData = await dbHandler.addUserToTeam(req.db, res.locals.id, res.locals.name, team).catch((e) => { console.error(e); err_occur = true; });
    const err = returns.err_occur || err_occur;
    if (err) {
      res.status(StatusCodes.no_data).json({
        success: false,
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
