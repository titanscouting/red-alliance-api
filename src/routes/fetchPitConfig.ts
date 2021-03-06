import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

module.exports = (app: any, dbHandler: any) => {
  const validation = {
    query: Joi.object({
      competition: Joi.string().required(),
      team: Joi.string().required(),
    }),
  }
  app.get('/api/fetchPitConfig', validate(validation, { keyByField: true }, {}), async (req: any, res:any) => {
    let val: UserReturnData = new UserReturnData();
    const { competition }: Record<string, string> = req.query;
    const team_number: number = parseInt(req.query.team, 10);
    let dataInterim: Record<string, unknown>;
    val = await dbHandler.fetchPitConfig(req.db, competition, team_number).catch((e) => { console.error(e); val.err_occur = true; });
    try {
      dataInterim = val.data.config;
    } catch (e) {
      val.err_occur = true;
    }

    // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
    if (val.err_occur === false) {
      res.json({
        success: true,
        competition,
        team_number,
        config: dataInterim,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
