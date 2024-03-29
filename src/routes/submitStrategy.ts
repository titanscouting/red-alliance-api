import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import Scouter from '../Scouter';
import StatusCodes from '../StatusCodes';

/**
* POST route '/api/submitStrategy'
* Allows users to submit potential match comments to be shown in the app.
* @param competition is the competition ID (ex: 2020ilch).
* @param match is the match that we seek data for.
* @param data is the JSON data to submit
* @returns back to the client let resobj (success status) and HTTP Status Code 200 OK.
*/

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    body: Joi.object({
      match: Joi.number().required(),
      competition: Joi.string().required(),
      data: Joi.string().required(),
    }),
  }
  app.post('/api/submitStrategy', auth.checkAuth, validate(validation, { keyByField: true }, { allowUnknown: true }), auth.checkAuth, async (req: any, res:any) => {
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id), team: res.locals.team };
    const competitionID = String(req.body.competition);
    const data = String(req.body.data);
    const matchNumber = String(req.body.match);
    // Application exhibits unpredicatble behavior if `if` evaluates to true, so we just filter that out.
    const val: UserReturnData  = await dbHandler.submitStrategy(req.db, scouter, matchNumber, competitionID, data);

    if (val.err_occur === false) {
      res.locals.io.sockets.emit(`${String(scouter.team)}_${competitionID}_${matchNumber}_newStrategy`, {})
      res.json({
        success: true,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
