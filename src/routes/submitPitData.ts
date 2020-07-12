import UserReturnData from './UserReturnData';
import Scouter from './Scouter';

module.exports = (app: any, dbHandler: any, auth: any) => {
  app.post('/api/submitPitData', auth.checkAuth, async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id) };
    const competitionID = String(req.body.competitionID);
    const matchNumber: number = parseInt(req.body.matchNumber, 10);
    const teamScouted: number = parseInt(req.body.teamScouted, 10);
    const { data } = req.body;
    try {
      val.data = await dbHandler.submitPitData(req.db, scouter, competitionID, matchNumber, teamScouted, data).catch((e) => { console.error(e); val.err_occur = true; });
    } catch (err) {
      console.error(err);
      val.err_occur = true;
    }

    let resobj = null;
    if (val.err_occur === false) {
      resobj = {
        success: true,
        competition: competitionID,
        matchNumber,
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
