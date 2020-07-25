import UserReturnData from './UserReturnData';

module.exports = (app:any, dbHandler:any, auth: any) => {
  app.get('/api/getUserStrategy', auth.checkAuth, async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const { competition, match_number }: Record<string, string> = req.query;
    const { name }: Record<string, string> = res.locals;
    val.data = await dbHandler.getUserStrategy(req.db, competition, match_number, name).catch((e) => { console.error(e); val.err_occur = true; });
    // the try...catch is the next few lines serves to ensure the application doesn't just crash if scouters or teams were not returned by the DB handler.
    let dataInterim: Array<any>;
    try {
      dataInterim = val.data.data;
    } catch (e) {
      val.err_occur = true;
    }
    let resobj = null;
    if (val.err_occur === false) {
      resobj = {
        success: true,
        data: dataInterim,
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
