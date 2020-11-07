import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

module.exports = (app:any, auth: any) => {
  const validation = {
    query: Joi.object({
      team: Joi.string().required(),
    }),
  }
  app.get('/api/checkUserTeam', auth.checkAuth, validate(validation, { keyByField: true }, {}), async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const { id, team, name } = res.locals;
    if (val.err_occur === false) {
      res.json({
        success: true,
        id,
        team,
        name,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  })
}
