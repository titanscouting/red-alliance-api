import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';
import Scouter from '../Scouter';

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    query: Joi.object({
      competition: Joi.string().required(),
      match: Joi.string().required(),
      teamScouted: Joi.string().required(),
    }),
  }
  app.get('/api/fetchMatchData', auth.checkAuth, validate(validation, { keyByField: true }, { allowUnknown: true }), async (req: any, res:any) => {
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id), team: String(res.locals.team) };
    let val: UserReturnData = new UserReturnData();
    const competition = String(req.query.competition);
    const match = parseInt(req.query.match, 10);
    const teamScouted = String(req.query.teamScouted);
    let dataInterim;
    val = await dbHandler.fetchMatchData(req.db, competition, match, teamScouted, scouter).catch((e) => { console.error(e); val.err_occur = true; val.err_reasons.push(e); });
    // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
    try {
      dataInterim = val.data;
      if (dataInterim === null) {
        dataInterim = { data: {} }
      }
    } catch (e) {
      val.err_occur = true;
    }
    if (val.err_occur === false) {
      res.json({
        success: true,
        competition,
        match,
        teamScouted,
        data: dataInterim.data,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
