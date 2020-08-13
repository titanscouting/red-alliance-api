import UserReturnData from './UserReturnData';
import Scouter from './Scouter';
import StatusCodes from './StatusCodes';

module.exports = (app: any, dbHandler: any, auth: any) => {
  app.post('/api/removeScouterFromMatch', auth.checkAuth, async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id) };
    const match = String(req.body.match);
    const teamScouted: number = parseInt(req.body.team_scouting, 10);
    if (!(match && teamScouted)) {
      res.status(StatusCodes.not_enough_info).json({
        success: false,
        reasons: ['A required parameter (match or team scouted) was not provided'],
      })
    }
    val.data = await dbHandler.removeScouterFromMatch(req.db, scouter.id, match, teamScouted).catch((e) => { console.error(e); val.err_occur = true; });
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
