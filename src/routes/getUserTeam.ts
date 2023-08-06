import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';


/**
* GET route '/api/getUserTeam'
* Bit of a misnomer, but returns the ID data we have on an authenticated user.
* @returns back to the client let resobj (success status) and HTTP Status Code 200 OK.
*/

module.exports = (app:any, auth: any) => {
  app.get('/api/getUserTeam', auth.checkAuth, async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const { id, team, name } = res.locals;
    if (val.err_occur === false) {
      res.json({
        success: true,
        id,
        team,
        name,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  })
}
