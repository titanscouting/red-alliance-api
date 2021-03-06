import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    body: Joi.object({
      team_number: Joi.number().required(),
      competition: Joi.string().required(),
      data: Joi.object().required(),
    }),
  }
  app.post('/api/submitTeamTestsData', validate(validation, { keyByField: true }, {}), auth.checkAuth, async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const competitionID: string = req.body.competition;
    const { team_number } = req.body;
    const { data } = req.body;
    // Application exhibits unpredicatble behavior if `if` evaluates to true, so we just filter that out.
    val.data = await dbHandler.submitTeamTestsData(req.db, team_number, competitionID, data);

    if (val.err_occur === false) {
      res.json({
        success: true,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
