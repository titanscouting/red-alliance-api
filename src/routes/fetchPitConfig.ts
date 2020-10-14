import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

module.exports = (app: any, dbHandler: any) => {
  app.get('/api/fetchPitConfig', async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const { competition }: Record<string, string> = req.query;
    const team_number: number = parseInt(req.query.team, 10);
    if (!(competition && team_number)) {
      val.err_occur = true;
      val.err_reasons.push('A required parameter (competition ID or team number) was not provided');
    }
    val.data = await dbHandler.fetchPitConfig(req.db, competition, team_number).catch((e) => { console.error(e); val.err_occur = true; });
    // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
    let dataInterim: Record<string, unknown>;
    try {
      dataInterim = val.data.data.config;
    } catch (e) {
      val.err_occur = true;
    }
    if (val.err_occur === false) {
      res.json({
        success: true,
        competition,
        team_number,
        config: dataInterim,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
