import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';


/**
* GET route '/api/fetchAnalysisFlags'
* Get a given analysis flag (used by the analysis engine).
* @param flag is the flag name in the DB. 
* @returns back to the client let resobj (success status) and HTTP Status Code 200 OK.
*/

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    query: Joi.object({
      flag: Joi.string().required(),
    }),
  }
  app.get('/api/fetchAnalysisFlags', auth.checkAuth, validate(validation, { keyByField: true }, { allowUnknown: true }), async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const { flag }: Record<string, string> = req.query;
    val.data = await dbHandler.fetchAnalysisFlags(req.db, res.locals.team).catch((e) => { console.error(e); val.err_occur = true; });
    if (val.data.data[flag] === undefined) {
      val.err_occur = true
      val.err_reasons.push('Flag not present in DB.')
    }
    if (val.err_occur === false) {
      res.json({
        success: true,
        flag,
        data: val.data.data[flag],
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
