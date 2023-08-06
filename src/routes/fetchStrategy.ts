import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';
import Scouter from '../Scouter';

/**
* GET route '/api/fetchStrategy'
* Get all user-submitted strategies for a given competition and match.
* @param competition is the competition ID (ex: 2020ilch).
* @param match is the match that we seek data for.
* @returns back to the client let resobj (success status) and HTTP Status Code 200 OK.
*/

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    query: Joi.object({
      competition: Joi.string().required(),
      match: Joi.number().required(),
    }),
  }
  app.get('/api/fetchStrategy', auth.checkAuth, validate(validation, { keyByField: true }, { allowUnknown: true }), async (req: any, res:any) => {
    let val: UserReturnData = new UserReturnData();
    const { competition }: Record<string, string> = req.query;
    const matchNumber: number = req.query.match;
    let dataInterim: Array<any>;
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id), team: String(res.locals.team) };

    val = await dbHandler.fetchStrategy(req.db, competition, matchNumber, scouter).catch((e) => { console.error(e); val.err_occur = true; });
    // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.

    try {
      dataInterim = val.data;
    } catch (e) {
      val.err_occur = true;
    }

    if (val.err_occur === false) {
      res.json({
        success: true,
        data: dataInterim,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
