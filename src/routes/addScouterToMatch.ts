import UserReturnData from './UserReturnData';
import Scouter from './Scouter';

module.exports = (app:any, dbHandler:any, auth: any) => {
  app.post('/api/addScouterToMatch', auth.checkAuth, async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id) };
    const match = String(req.body.match);
    const teamScouted: number = parseInt(req.body.team_scouting, 10);
    try {
      val.data = await dbHandler.addScouterToMatch(req.db, scouter.id, scouter.name, match, teamScouted).catch((e) => { console.error(e); val.err_occur = true; });
    } catch (err) {
      console.error(err);
      val.err_occur = true;
    }
    let resobj = null;
    if (val.err_occur === false) {
      resobj = {
        success: true,
      };
    } else {
      resobj = {
        success: false,
        reasons: val.err_reasons,
      };
    }
    res.json(resobj);
  });
};
