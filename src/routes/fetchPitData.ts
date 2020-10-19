import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

module.exports = (app: any, dbHandler: any) => {
  app.get('/api/fetchPitData', async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const { competition }: Record<string, string> = req.query;
    if (!(competition)) {
      val.err_occur = true;
      val.err_reasons.push('A required parameter (competition ID) was not provided')
    }
    const teamScouted = parseInt(req.query.team_scouted, 10);
    val.data = await dbHandler.fetchPitData(req.db, competition, 0, teamScouted).catch((e) => { console.error(e); val.err_occur = true; });
    // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
    let dataInterim: Record<string, unknown>;
    try {
      dataInterim = val.data.data.data;
    } catch (e) {
      val.err_occur = true;
    }
    if (val.err_occur === false) {
      res.json({
        success: true,
        competition,
        teamScouted,
        data: dataInterim,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
