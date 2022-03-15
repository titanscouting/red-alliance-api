import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import Scouter from '../Scouter';
import StatusCodes from '../StatusCodes';

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
    const competitionID = String(req.body.competitionID);
    const teamScouted = String(req.body.teamScouted);
    const { data }: Record<string, any> = req.body;
    console.log(competitionID, teamScouted, scouter)
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
