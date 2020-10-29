import uuidAPIKey from 'uuid-apikey';
import { validate, ValidationError, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

/**
 * POST route '/api/addAPIKey'
 * Allows the creation of API keys from current OAuth users.
 * @param token in form of header with title 'token' and value of JWT provided by Google OAuth
 * @returns back to the client let resobj (success, client id, and client secret generated) and HTTP Status Code 200 OK.
 */
module.exports = (app, dbHandler, auth) => {
  app.post('/api/addAPIKey', auth.noAPIKey, auth.checkAuth, async (req: any, res:any) => {
    const { team } = req.body;
    if (!team) {
      req.status(StatusCodes.no_data).json({
        success: false,
        err_reasons: ['Team not provided'],
      })
    }
    const val: UserReturnData = new UserReturnData();
    const clientInfo = await uuidAPIKey.create();
    val.data = await dbHandler.addKey(req.db, clientInfo.uuid, clientInfo.apiKey, team).catch((e) => { console.error(e); val.err_occur = true; });
    if (val.err_occur === false) {
      res.json({
        success: true,
        CLIENT_ID: clientInfo.uuid,
        CLIENT_SECRET: clientInfo.apiKey,
        team: req.body.team,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
