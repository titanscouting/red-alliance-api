import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    query: Joi.object({
      competition: Joi.string().required(),
    }),
  }
  app.get('/api/fetchTeamSchedule', auth.checkAuth, validate(validation, { keyByField: true }, { allowUnknown: true }), async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const competition = String(req.query.competition);
    const team = String(res.locals.team);

    val.data = await dbHandler.fetchTeamSchedule(req.db, competition, team).catch((e) => { console.error(e); val.err_occur = true; });
    if (val.err_occur === false) {
      res.json({
        success: true,
        competition,
        team,
        data: val.data.data,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
