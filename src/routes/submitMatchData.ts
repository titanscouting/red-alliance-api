import { validate, Joi } from 'express-validation';
import Scouter from '../Scouter';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

/**
* POST route '/api/submitMatchData'
* Submit match data about a team for a given competition and match.
* @param competition is the competition ID (ex: 2020ilch).
* @param teamScouted is the team that we seek data for.
* @param match is the match that we seek data for.
* @param data is the JSON data to submit
* @returns back to the client let resobj (success status) and HTTP Status Code 200 OK.
*/

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    body: Joi.object({
      match: Joi.number().required(),
      teamScouted: Joi.number().required(),
      competition: Joi.string().required(),
      data: Joi.object().required(),
    }),
  }
  app.post('/api/submitMatchData', auth.checkAuth, validate(validation, { keyByField: true }, { allowUnknown: true }), async (req: any, res: any) => {
    let val: UserReturnData = new UserReturnData();
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id), team: String(res.locals.team) };
    const { competition, data }: Record<string, string> = req.body;
    const match: number = parseInt(req.body.match, 10);
    const teamScouted = String(req.body.teamScouted);
    val = await dbHandler.submitMatchData(req.db, scouter,
      competition, match, teamScouted, data).catch(
      (e: string) => {
        console.error(e); val.err_occur = true;
      },
    );
    if (val.err_occur === false) {
      res.locals.io.sockets.emit(`${String(res.locals.team)}_newMatchData`, {
        match, team: teamScouted,
      })
      res.json({
        success: true,
        competition,
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
