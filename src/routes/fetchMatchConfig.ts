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
  app.get('/api/fetchMatchConfig', validate(validation, { keyByField: true }, { allowUnknown: true }), async (req: any, res:any) => {
    let val: UserReturnData = new UserReturnData();
    const { competition }: Record<string, string> = req.query;
    const team: number = parseInt(req.query.team, 10);
    let dataInterim: Record<string, unknown>;

    val = await dbHandler.fetchMatchConfig(req.db, competition, team).catch((e) => { console.error(e); val.err_occur = true; });
    try {
      dataInterim = val.data.config
    } catch (e) {
      val.err_occur = true;
    }

    // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
    if (val.err_occur === false) {
      res.json({
        success: true,
        competition,
        team,
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
