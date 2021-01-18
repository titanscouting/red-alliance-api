import { validate, Joi } from 'express-validation';
import Scouter from '../Scouter';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    body: Joi.object({
      match: Joi.number().required(),
      teamScouted: Joi.number().required(),
      competition: Joi.string().required(),
      data: Joi.object().required(),
    }),
  }
  app.post('/api/submitMatchData', auth.checkAuth, validate(validation, { keyByField: true }, {}), async (req: any, res: any) => {
    let val: UserReturnData = new UserReturnData();
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id) };
    const { competition, data }: Record<string, string> = req.body;
    const match: number = parseInt(req.body.match, 10);
    const teamScouted: number = parseInt(req.body.teamScouted, 10);
    val = await dbHandler.submitMatchData(req.db, scouter,
      competition, match, teamScouted, data).catch(
      (e: string) => {
        console.error(e); val.err_occur = true;
      },
    );
    if (val.err_occur === false) {
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
