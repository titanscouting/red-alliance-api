import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';


/**
* POST route '/api/setAnalysisFlags'
* Enables analysis engine to store stateful data in a key-value store.
* @param flag is the flag name.
* @param data is the flag data.
* @returns back to the client let resobj (success status) and HTTP Status Code 200 OK.
*/

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    body: Joi.object({
      flag: Joi.string().required(),
      data: Joi.required(),
    }),
  }
  app.post('/api/setAnalysisFlags', auth.checkAuth, validate(validation, { keyByField: true }, { allowUnknown: true }), async (req: any, res:any) => {
    const { flag, data } = req.body;
    const { team } = res.locals;
    // Application exhibits unpredicatble behavior if `if` evaluates to true, so we just filter that out.
    const val: UserReturnData  = await dbHandler.setAnalysisFlags(req.db, flag, data, team);

    if (val.err_occur === false) {
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
