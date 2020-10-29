import UserReturnData from '../../UserReturnData';
import StatusCodes from '../../StatusCodes';

module.exports = (app: any, dbHandler: any) => {
  app.get('/api/backend-data/fetchTeamPitData', async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const competition = String(req.query.competition);
    const team_num = String(req.query.team_num)
    if (!(competition) || !(team_num)) {
      if(!(competition)){
        val.err_occur = true;
        val.err_reasons.push('A required parameter (competition) was not provided');
      }
      if(!(team_num)){
        val.err_occur = true;
        val.err_reasons.push('A required parameter (team_num) was not provided');
      }
    } else {
      val.data = await dbHandler.fetchTeamPitData(req.db, competition, team_num).catch((e) => { console.error(e); val.err_occur = true; });
    }
    if (val.err_occur === false) {
      res.json({
        success: true,
        competition,
        data: val.data.data,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
