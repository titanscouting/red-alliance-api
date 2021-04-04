import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    body: Joi.object({
      team: Joi.string().required(),
    }),
  }
  app.post('/api/addUserToTeam', auth.noAPIKey, auth.checkAuthNoTeam, validate(validation, { keyByField: true }, { allowUnknown: true }), async (req, res) => {
    let val: UserReturnData = new UserReturnData();
    const team = parseInt(req.body.team, 10)
    val = await dbHandler.addUserToTeam(req.db, res.locals.id, res.locals.email, res.locals.name, team.toString()).catch((e) => { console.error(e); val.err_occur = true; });
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
