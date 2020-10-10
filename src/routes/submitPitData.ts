import UserReturnData from './UserReturnData';
import Scouter from './Scouter';
import StatusCodes from './StatusCodes';

module.exports = (app: any, dbHandler: any, auth: any) => {
  app.post('/api/submitPitData', auth.checkAuth, async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id) };
    const competitionID = String(req.body.competitionID);
    const matchNumber: number = parseInt(req.body.matchNumber, 10);
    const teamScouted: number = parseInt(req.body.teamScouted, 10);
    const { data }: Record<string, any> = req.body;
    if (!(matchNumber && teamScouted && competitionID && data)) {
      res.status(StatusCodes.not_enough_info).json({
        success: false,
        reasons: ['A required parameter (match number, team scouted, competition ID, or data) was not provided'],
      })
    }
    val.data = await dbHandler.submitPitData(req.db, scouter, competitionID, matchNumber, teamScouted, data).catch((e) => { console.error(e); val.err_occur = true; });
    if (val.err_occur === false) {
      res.json({
        success: true,
        competition: competitionID,
        matchNumber,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
