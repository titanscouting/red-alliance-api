import UserReturnData from '../UserReturnData';
import Scouter from '../Scouter';
import StatusCodes from '../StatusCodes';

module.exports = (app: any, dbHandler: any, auth: any) => {
  app.post('/api/submitPitConfig', auth.checkAuth, async (req: any, res:any) => {
-    const val: UserReturnData = new UserReturnData();
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id), team: parseInt(res.locals.team, 10) };
    const competitionID = String(req.body.competitionID);
    const { config }: Record<any, Array<Record<any, any>>> = req.body;
    if (!(competitionID && config)) {
      res.status(StatusCodes.not_enough_info).json({
        success: false,
        reasons: ['A required parameter (match number, team scouted, competition ID, or data) was not provided'],
      })
    }
  });
};
