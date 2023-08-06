import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';
import Scouter from '../Scouter';


/**
* GET route '/api/fetchAllTeamPitData'
* Get all pit data about a team for a given competition.
* @param competition is the competition ID (ex: 2020ilch).
* @param teamScouted is the team that we seek data for.
* @returns back to the client let resobj (success status) and HTTP Status Code 200 OK.
*/

module.exports = (app: any, dbHandler: any, auth:any) => {
  const validation = {
    query: Joi.object({
      competition: Joi.string().required(),
      teamScouted: Joi.number(),
    }),
  }
  app.get('/api/fetchAllTeamPitData', auth.checkAuth, validate(validation, { keyByField: true }, { allowUnknown: true }), async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const { competition, teamScouted }: Record<string, string> = req.query;
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id), team: String(res.locals.team) };
    let dataInterim;
    val.data = await dbHandler.fetchAllTeamPitData(req.db, competition, teamScouted, scouter).catch((e) => { console.error(e); val.err_occur = true; val.err_reasons.push(e); });
    // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
    try {
      dataInterim = val.data.data;
    } catch (e) {
      val.err_occur = true;
    }
    if (val.err_occur === false) {
      res.json({
        success: true,
        competition,
        teamScouted,
        data: dataInterim,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
