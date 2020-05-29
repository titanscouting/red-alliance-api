import UserReturnData from "./UserReturnData";
module.exports = (app: any, dbHandler: any) => {
    app.get('/api/fetch2022Schedule', async (req: any, res:any) => {
        let val: UserReturnData =  new UserReturnData();
        const competition = String(req.query.competition);
        try {
          val.data = await dbHandler.fetch2022Schedule(req.db, competition).catch((e) => { console.error(e); val.err_occur = true; });
        } catch (e) {
          console.error(e);
          val.err_occur = true;
        }
        let resobj = null;
        if (val.err_occur === false) {
          resobj = {
            success: true,
            competition,
            data: val.data.data,
          };
        } else {
          resobj = {
            success: false,
            reasons: val.err_reasons,
          };
        }
        res.json(resobj);
      });
}
