import UserReturnData from './UserReturnData';

module.exports = (app: any, dbHandler: any) => {
  app.get('/api/fetchStrategy', async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const comp = String(req.query.competition);
    const match = String(req.query.match);
    try {
      val.data = await dbHandler.fetchStrategy(req.db, comp, match).catch((e) => { console.error(e); val.err_occur = true; });
    } catch (err) {
      console.error(err);
      val.err_occur = true;
    }
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
