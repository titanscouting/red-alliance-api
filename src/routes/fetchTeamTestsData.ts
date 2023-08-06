import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';


/**
* GET route '/api/fetchTeamTestsData'
* Gets analysis data for a competition and team from the analysis engine outputs.
* @param competition is the competition ID (ex: 2020ilch).
* @param team is the team that we seek data for.
* @returns back to the client let resobj (success status) and HTTP Status Code 200 OK.
*/

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    query: Joi.object({
      competition: Joi.string().required(),
      team: Joi.string().required(),
    }),
  }
  app.get('/api/fetchTeamTestsData', auth.checkAuth, validate(validation, { keyByField: true }, { allowUnknown: true }), async (req: any, res:any) => {
    if (res.locals.team !== '2022') {
      return res.json({
        success: false,
        reasons: ['Analysis data is only available to team 2022.'],
      })
    }
    let val: UserReturnData = new UserReturnData();
    const competition = String(req.query.competition);
    const team = parseInt(req.query.team, 10);
    let dataInterim;
    val = await dbHandler.fetchTeamTestsData(req.db, competition, team).catch((e) => { console.error(e); val.err_occur = true; val.err_reasons.push(e); });
    // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
    try {
      dataInterim = val.data;
      if (dataInterim === null) {
        dataInterim = { data: {} }
      }
    } catch (e) {
      val.err_occur = true;
    }
    if (val.err_occur === false) {
      res.json({
        success: true,
        competition,
        team: String(team),
        data: dataInterim.data,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
