import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';
import Scouter from '../Scouter'
/**
 * GET route '/api/fetchCompetitionSchedule'
 * Allows the application to get all the matches for a given competition.
 * @param competition is the Competition id: e.g. '2020ilch'.
 * @returns back to the client let resobj (competition and ) and HTTP Status Code 200 OK.
 */
module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    query: Joi.object({
      competition: Joi.string().required(),
    }),
  }
  app.get('/api/fetchCompetitionSchedule', auth.checkAuth, validate(validation, { keyByField: true }, { allowUnknown: true }), async (req: any, res:any) => {
    let val: UserReturnData = new UserReturnData();
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id), team: String(res.locals.team) };
    const { competition }: Record<string, string> = req.query;
    val = await dbHandler.fetchCompetitionSchedule(req.db, competition, scouter).catch((e) => { console.error(e); val.err_occur = true; return {}; });
    if (val.err_occur === false) {
      res.json({
        success: true,
        competition,
        data: val.data,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
