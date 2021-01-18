import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

module.exports = (app: any, dbHandler: any) => {
  const validation = {
    query: Joi.object({
      competition: Joi.string().required(),
      match: Joi.string().required(),
      teamScouted: Joi.string().required(),
    }),
  }
  app.get('/api/fetchMatchData', validate(validation, { keyByField: true }, {}), async (req: any, res:any) => {
    let val: UserReturnData = new UserReturnData();
    const competition = String(req.query.competition);
    const match = parseInt(req.query.match, 10);
    const teamScouted = parseInt(req.query.teamScouted, 10);
    let dataInterim;
    val = await dbHandler.fetchMatchData(req.db, competition, match, teamScouted).catch((e) => { console.error(e); val.err_occur = true; val.err_reasons.push(e); });
    // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
    try {
      dataInterim = val.data;
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
