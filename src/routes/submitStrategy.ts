import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import Scouter from '../Scouter';
import StatusCodes from '../StatusCodes';

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    body: Joi.object({
      match: Joi.number().required(),
      competition: Joi.string().required(),
      data: Joi.string().required(),
    }),
  }
  app.post('/api/submitStrategy', auth.checkAuth, validate(validation, { keyByField: true }, {}), auth.checkAuth, async (req: any, res:any) => {
    let val: UserReturnData = new UserReturnData();
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id) };
    const competitionID = String(req.body.competition);
    const data = String(req.body.data);
    const matchNumber = String(req.body.match);
    if (!(competitionID && data && matchNumber) || data === null) {
      res.status(StatusCodes.not_enough_info).json({
        success: false,
        reasons: ['A required parameter (competition ID, data, or match number) was not provided'],
      })
    } else {
      // Application exhibits unpredicatble behavior if `if` evaluates to true, so we just filter that out.
      val = await dbHandler.submitStrategy(req.db, scouter.name, matchNumber, competitionID, data);
    }

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
