import UserReturnData from './UserReturnData';

// FIXME: Add correct documentation
/**
 * GET route '/api/checkUser'
 * Allows the application to fetch the list of matches and the number of scouters for the match.
 * @param token is the token obtained from Google OAuth and the JWT.
 * @returns back to the client let resobj (name and Google ID of user) and HTTP Status Code 200 OK.
 */

// TODO: Write tests for this

module.exports = (app: any, dbHandler: any) => {
  app.get('/api/checkUser', async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    val.data = await dbHandler.checkKey(req.db, req.query.CLIENT_ID, req.query.CLIENT_SECRET).catch((e) => { console.error(e); val.err_reasons.push(e); val.err_occur = true; });
    let resobj = null;
    if (!val.err_occur) {
      resobj = {
        success: true,
        isAuth: val.data,
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
