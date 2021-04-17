import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    body: Joi.object({
      flag: Joi.string().required(),
      data: Joi.required(),
    }),
  }
  app.post('/api/setAnalysisFlags', auth.checkAuth, validate(validation, { keyByField: true }, { allowUnknown: true }), async (req: any, res:any) => {
    let val: UserReturnData = new UserReturnData();
    const { flag, data } = req.body;
    const { team } = res.locals;
    // Application exhibits unpredicatble behavior if `if` evaluates to true, so we just filter that out.
    val = await dbHandler.setAnalysisFlags(req.db, flag, data, team);

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
