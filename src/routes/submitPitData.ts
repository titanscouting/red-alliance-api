import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import Scouter from '../Scouter';
import StatusCodes from '../StatusCodes';

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    query: Joi.object({
      matchNumber: Joi.number().required(),
      teamScouted: Joi.number().required(),
      competitionID: Joi.string().required(),
      data: Joi.string().required(),
    }),
  }
  app.post('/api/submitPitData', auth.checkAuth, validate(validation, { keyByField: true }, {}), async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id) };
    const competitionID = String(req.body.competitionID);
    const matchNumber: number = parseInt(req.body.matchNumber, 10);
    const teamScouted: number = parseInt(req.body.teamScouted, 10);
    const { data }: Record<string, any> = req.body;
    val.data = await dbHandler.submitPitData(req.db, scouter, competitionID, matchNumber, teamScouted, data).catch((e) => { console.error(e); val.err_occur = true; });
  });
};
