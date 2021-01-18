import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    body: Joi.object({
      team: Joi.string().required(),
    }),
  }
  app.post('/api/addUserToTeam', auth.noAPIKey, auth.checkAuth, validate(validation, { keyByField: true }, {}), async (req, res) => {
    const val: UserReturnData = new UserReturnData();
    const team = parseInt(req.body.team, 10)
    val.data = await dbHandler.addUserToTeam(req.db, res.locals.id, res.locals.name, team).catch((e) => { console.error(e); val.err_occur = true; });
    if (val.err_occur) {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    } else {
      res.json({
        success: true,
        name: res.locals.name,
        id: res.locals.id,
        team: req.body.team,
      })
    }
  })
};
