import { validate, Joi } from 'express-validation';
import UserReturnData from '../UserReturnData';
import Scouter from '../Scouter';
import StatusCodes from '../StatusCodes';

module.exports = (app: any, dbHandler: any, auth: any) => {
  const validation = {
    body: Joi.object({
      match: Joi.number().required(),
      competition: Joi.string().required(),
      data: Joi.string().required(),
    }),
  }
  app.post('/api/submitStrategy', auth.checkAuth, validate(validation, { keyByField: true }, { allowUnknown: true }), auth.checkAuth, async (req: any, res:any) => {
    let val: UserReturnData = new UserReturnData();
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id), team: res.locals.team };
    const competitionID = String(req.body.competition);
    const data = String(req.body.data);
    const matchNumber = String(req.body.match);
    // Application exhibits unpredicatble behavior if `if` evaluates to true, so we just filter that out.
    val = await dbHandler.submitStrategy(req.db, scouter.name, matchNumber, competitionID, data);

    if (val.err_occur === false) {
      res.locals.io.sockets.emit(`${String(scouter.team)}_${competitionID}_${matchNumber}_newStrategy`, {})
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
