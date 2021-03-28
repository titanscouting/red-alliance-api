import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

/**
 * GET route '/api/fetchCompetitionFriendlyName'
 * Allows the application to fetch the friendly name for a competition identifier (For example, 2020ilch = 2020 Midwest Regional)
 * @param competition is the identifier for the competition: e.g. '2020ilch'.
 * @returns back to the client let resobj (competition id, competition friendly name) and HTTP Status Code 200 OK.
 */
module.exports = (app, dbHandler) => {
  const validation = {
    query: Joi.object({
      competition: Joi.string().required(),
    }),
  }
  app.get('/api/fetchCompetitionFriendlyName', validate(validation, { keyByField: true }, { allowUnknown: true }), async (req: any, res:any) => {
    let val: UserReturnData = new UserReturnData();
    const competition = String(req.query.competition);
    val = await dbHandler.fetchCompetitionFriendlyName(req.db, competition).catch((e) => { console.error(e); val.err_occur = true; });
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
