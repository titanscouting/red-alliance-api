import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

/**
* GET route '/api/fetchMetricsData'
* Get analysis metrics (elo/glicko2) for a given team and competition.
* @param competition is the competition ID (ex: 2020ilch).
* @param team is the team that we seek data for.
* @returns back to the client let resobj (success status) and HTTP Status Code 200 OK.
*/

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    query: Joi.object({
      competition: Joi.string().required(),
      team: Joi.string().required(),
    }),
  }
  app.get('/api/fetchMetricsData', auth.checkAuth, validate(validation, { keyByField: true }, { allowUnknown: true }), async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const { competition }: Record<string, string> = req.query;
    const team = parseInt(req.query.team, 10);
    val.data = await dbHandler.fetchMetricsData(req.db, competition, team).catch((e) => { console.error(e); val.err_occur = true; });
    if (val.err_occur === false) {
      res.json({
        success: true,
        competition,
        team,
        metrics: val.data.data != null ? val.data.data.metrics[competition] : null,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
