import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import Scouter from '../Scouter';
import StatusCodes from '../StatusCodes';

/**
* POST route '/api/submitPitData'
* Submit pit data about a team for a given competition and match.
* @param competition is the competition ID (ex: 2020ilch).
* @param teamScouted is the team that we seek data for.
* @param data is the JSON data to submit
* @returns back to the client let resobj (success status) and HTTP Status Code 200 OK.
*/

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    body: Joi.object({
      teamScouted: Joi.number().required(),
      competition: Joi.string().required(),
      data: Joi.object().required(),
    }),
  }
  app.post('/api/submitPitData', auth.checkAuth, validate(validation, { keyByField: true }, { allowUnknown: true }), async (req: any, res:any) => {
    let val: UserReturnData = new UserReturnData();
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id), team: String(res.locals.team) };
    const competitionID = String(req.body.competition);
    const teamScouted = String(req.body.teamScouted);
    const { data }: Record<string, any> = req.body;
    val = await dbHandler.submitPitData(req.db, scouter, competitionID, teamScouted, data).catch((e) => { console.error(e); val.err_occur = true; });
    if (val.err_occur === false) {
      res.locals.io.sockets.emit(`${String(scouter.team)}_${competitionID}_newPitData`, {})
      res.json({
        success: true,
        competition: competitionID,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
