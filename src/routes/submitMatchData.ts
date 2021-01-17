import { validate, Joi } from 'express-validation';
import Scouter from '../Scouter';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';
/**
 * POST route '/api/submitMatchData'
 * Allows the application to submit data to the API, with some key data seperated within the
 * JSON and the rest submitted as arbirtary structures within the data key.
 * @param token in form of header with title 'token' and value of JWT provided by Google OAuth
 * @param competition is the identifier for the competition: e.g. '2020ilch'.
 * @param match is the number of the match scouted: e.g. '1'.
 * @param teamScouted is the team that was being scouted: e.g. '3061'.
 * @param data is the arbritrary other data that needs to be recorded for the match.
 * @returns back to the client resobj (success boolean, competition id, and match number)
 * and HTTP Status Code 200 OK.
 */

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    query: Joi.object({
      match: Joi.number().required(),
      teamScouted: Joi.number().required(),
      competition: Joi.string().required(),
      data: Joi.string().required(),
    }),
  }
  app.post('/api/submitMatchData', auth.checkAuth, validate(validation, { keyByField: true }, {}), async (req: any, res: any) => {
    const val: UserReturnData = new UserReturnData();
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id) };
    const { competition, data }: Record<string, string> = req.body;
    const match: number = parseInt(req.body.match, 10);
    const teamScouted: number = parseInt(req.body.teamScouted, 10);
    val.data = await dbHandler.submitMatchData(req.db, scouter,
      competition, match, teamScouted, data).catch(
      (e: string) => {
        console.error(e); val.err_occur = true;
      },
    );
    if (val.err_occur === false) {
      res.json({
        success: true,
        competition: competition,
        match,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
