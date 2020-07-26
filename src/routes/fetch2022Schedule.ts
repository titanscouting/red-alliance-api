import UserReturnData from './UserReturnData';
import StatusCodes from './StatusCodes';

module.exports = (app: any, dbHandler: any) => {
  app.get('/api/fetch2022Schedule', async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const competition = String(req.query.competition);
    if (!(competition)) {
      res.status(StatusCodes.not_enough_info).json({
        success: false,
        reasons: ['A competition ID was not provided'],
      })
    }
    val.data = await dbHandler.fetch2022Schedule(req.db, competition).catch((e) => { console.error(e); val.err_occur = true; });
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
