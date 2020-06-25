import UserReturnData from './UserReturnData';
import Scouter from './Scouter';

module.exports = (app: any, dbHandler: any, auth: any) => {
  app.post('/api/submitStrategy', auth.checkAuth, async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id) };
    const comp = String(req.body.competition);
    const data = String(req.body.data);
    let doGet = true;
    // Application exhibits unpredicatble behavior if `if` evaluates to true, so we just filter that out.
    if (data === 'null' || scouter.name === 'undefined') {
      doGet = false;
    }
    const match = String(req.body.match);
    let resobj = null;
    if (doGet === true) {
      try {
        val.data = await dbHandler.submitStrategy(req.db, scouter.name, match, comp, data);
      } catch (err) {
        console.error(err);
        val.err_occur = true;
      }
      if (val.err_occur === false) {
        resobj = {
          success: true,
        };
      } else {
        resobj = {
          success: false,
          reasons: val.err_reasons,
        };
      }
    } else {
      resobj = {
        success: false,
        reasons: 'Data is null',
      };
    }
    res.json(resobj);
  });
};