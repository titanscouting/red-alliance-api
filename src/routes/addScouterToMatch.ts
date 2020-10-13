import UserReturnData from '../UserReturnData';
import Scouter from '../Scouter';
import StatusCodes from './StatusCodes';

module.exports = (app:any, dbHandler:any, auth: any) => {
  app.post('/api/addScouterToMatch', auth.checkAuth, async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id), team: parseInt(res.locals.team, 10) };
    const match = String(req.body.match);
    const competition = String(req.body.competition);
    if (!(match && competition)) {
      val.err_occur = true;
      val.err_reasons.push('A required parameter (match number or competition ID) was not provided');
    }
    const teamScouted: number = parseInt(req.body.team_scouting, 10);
    val.data = await dbHandler.addScouterToMatch(req.db, scouter.id, scouter.name, match, teamScouted).catch((e) => { console.error(e); val.err_occur = true; });
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
