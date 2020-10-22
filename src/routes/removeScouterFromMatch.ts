import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

module.exports = (app: any, dbHandler: any, auth: any) => {
  app.post('/api/removeScouterFromMatch', auth.checkAuth, async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const match = String(req.body.match);
    const teamScouted: number = parseInt(req.body.team_scouting, 10);
    const competition = String(req.body.competition);
    if (!(match && teamScouted && competition)) {
      val.err_occur = true;
      val.err_reasons.push('A required parameter (match, team scouted, or competition) was not provided')
    } else {
      val.data = await dbHandler.removeScouterFromMatch(req.db, match, teamScouted).catch((e) => { console.error(e); val.err_occur = true; });
    }

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
