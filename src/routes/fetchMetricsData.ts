import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

module.exports = (app: any, dbHandler: any) => {
  const validation = {
    query: Joi.object({
      competition: Joi.string().required(),
      team_number: Joi.string().required(),
    }),
  }
  app.get('/api/fetchMetricsData', validate(validation, { keyByField: true }, {}), async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const { competition }: Record<string, string> = req.query;
    const teamNumber = parseInt(req.query.team_scouted, 10);
    val.data = await dbHandler.fetchMetricsData(req.db, competition, teamNumber).catch((e) => { console.error(e); val.err_occur = true; });
    if (val.err_occur === false) {
      res.json({
        success: true,
        competition,
        teamNumber,
        data: val.data.data.data, // TODO: Fix that structure up a bit
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
