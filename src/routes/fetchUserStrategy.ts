import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';
import Scouter from '../Scouter';

module.exports = (app:any, dbHandler:any, auth:any) => {
  const validation = {
    query: Joi.object({
      competition: Joi.string().required(),
      match: Joi.number().required(),
    }),
  }
  app.get('/api/fetchUserStrategy', auth.checkAuth, validate(validation, { keyByField: true }, { allowUnknown: true }), async (req: any, res:any) => {
    let val: UserReturnData = new UserReturnData();
    const { competition, match }: Record<string, string> = req.query;
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id), team: res.locals.team };
    let dataInterim: Array<any>;

    val = await dbHandler.fetchUserStrategy(req.db, competition, match, scouter).catch((e) => { console.error(e); val.err_occur = true; });
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
