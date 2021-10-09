import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';
import Scouter from '../Scouter';

/**
 * GET route '/api/fetchScouterUIDs'
 * Allows the application to fetch which users are scouting a given match.
 * @param competition is the identifier for the competition: e.g. '2020ilch'.
 * @param matchNumber is the number of the match scouted: e.g. '1'.
 * @returns back to the client let resobj (competition id, array containing scouter information, and corresponding index teams) and HTTP Status Code 200 OK.
*/

module.exports = (app: any, dbHandler: any, auth:any) => {
  const validation = {
    query: Joi.object({
      competition: Joi.string().required(),
      match: Joi.number().required(),
    }),
  }
  app.get('/api/fetchScouterUIDs', auth.checkAuth, validate(validation, { keyByField: true }, { allowUnknown: true }), async (req: any, res:any) => {
    let val: UserReturnData = new UserReturnData();
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id), team: String(res.locals.team) };
    const competition = String(req.query.competition);
    const matchNumber = parseInt(req.query.match, 10);
    let scoutersInterim: Array<Record<string, unknown>>;
    let teamsInterim: Array<string>;
    val = await dbHandler.fetchScouterUIDs(req.db, competition, matchNumber, scouter).catch((e) => { console.error(e); val.err_occur = true; });
    // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
    try {
      scoutersInterim = val.data.scouters;
      teamsInterim = val.data.teams;
    } catch (e) {
      val.err_occur = true;
    }

    if (val.err_occur === false) {
      res.json({
        success: true,
        competition,
        scouters: scoutersInterim,
        teams: teamsInterim,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
