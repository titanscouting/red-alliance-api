import UserReturnData from './UserReturnData';

/**
 * GET route '/api/findTeamNickname'
 * Allows the application to get the nickname for a team, given the team number.
 * @param teamNum is the FRC team number: e.g. '2022'.
 * @returns back to the client let resobj (team number and nickname) and HTTP Status Code 200 OK.
*/

module.exports = (app: any, dbHandler: any) => {
  app.get('/api/findTeamNickname', async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const teamNumber = req.query.team_number;
    try {
      val.data = await dbHandler.findTeamNickname(req.db, teamNumber).catch((e) => { console.error(e); val.err_occur = true; });
    } catch (e) {
      console.error(e);
      val.err_occur = true;
    }
    let resobj = null;
    if (val.err_occur === false) {
      resobj = {
        success: true,
        teamNum: teamNumber,
        nickname: val.data.data,
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
