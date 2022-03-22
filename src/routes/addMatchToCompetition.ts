import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import Scouter from '../Scouter';
import StatusCodes from '../StatusCodes';

module.exports = (app:any, dbHandler:any, auth: any) => {
  const validation = {
    body: Joi.object({
      match: Joi.string().required(),
      competition: Joi.string().required(),
      teams: Joi.array().items(Joi.string()).required(),
    }),
  }
  app.post('/api/addMatchToCompetition', auth.checkAuth, validate(validation, { keyByField: true }, { allowUnknown: true }), async (req: any, res:any) => {
    let val: UserReturnData = new UserReturnData();
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id), team: String(res.locals.team) };
    const { competition, teams } = req.body;
    const match = parseInt(req.body.match, 10)
    val = await dbHandler.addMatchToCompetition(req.db, scouter, match, competition, teams).catch((e) => { console.error(e); val.err_occur = true; });
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
