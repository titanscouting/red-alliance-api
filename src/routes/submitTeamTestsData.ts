import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

/**
* POST route '/api/submitTeamTestsData'
* Allows analysis engine to submit match/pit statistical test metrics to be shown in the app.
* @param competition is the competition ID (ex: 2020ilch).
* @param team is the team the metrics are associated with.
* @param data is the JSON data to submit
* @returns back to the client let resobj (success status) and HTTP Status Code 200 OK.
*/

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    body: Joi.object({
      team: Joi.number().required(),
      competition: Joi.string().required(),
      data: Joi.object().required(),
    }),
  }
  app.post('/api/submitTeamTestsData', validate(validation, { keyByField: true }, { allowUnknown: true }), auth.checkAuth, async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const competitionID: string = req.body.competition;
    const { team } = req.body;
    const { data } = req.body;
    // Application exhibits unpredicatble behavior if `if` evaluates to true, so we just filter that out.
    val.data = await dbHandler.submitTeamTestsData(req.db, team, competitionID, data);

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
