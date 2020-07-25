import UserReturnData from './UserReturnData';

/**
  * POST route "/api/addUserToTeam"
  * Adds user to a team.
  * @param token in form of header with title 'token' and value of JWT provided by Google OAuth
  * @returns back to the client resobj and 200 OK.
 */
module.exports = (app: any, dbHandler: any, auth: any) => {
  app.post('/api/addUserToTeam', auth.checkAuth, async (req, res) => {
    const team = parseInt(req.body.team, 10)
    const returns: UserReturnData = await dbHandler.addUserToTeam(req.db, res.locals.id, res.locals.name, team);
    const err = returns.err_occur;
    const resobj = {
      success: !err,
      name: res.locals.name,
      id: res.locals.id,
      team: req.body.team,
    }
    res.json(resobj)
  })
};
