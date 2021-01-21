import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

module.exports = (app: any, dbHandler: any) => {
  const validation = {
    query: Joi.object({
      flag: Joi.string().required(),
    }),
  }
  app.get('/api/fetchAnalysisFlags', validate(validation, { keyByField: true }, {}), async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const { flag }: Record<string, string> = req.query;
    val.data = await dbHandler.fetchAnalysisFlags(req.db).catch((e) => { console.error(e); val.err_occur = true; });
    if (val.data.data[flag] === undefined) {
      val.err_occur = true
      val.err_reasons.push("Flag not present in DB.")
    }
    if (val.err_occur === false) {
      res.json({
        success: true,
        flag,
        data: val.data.data[flag]
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
