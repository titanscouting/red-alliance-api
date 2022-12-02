import uuidAPIKey from 'uuid-apikey';
import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';
import Scouter from '../Scouter';

module.exports = (app, dbHandler, auth) => {
  app.post('/api/addAPIKey', auth.noAPIKey, auth.checkAuth, async (req: any, res:any) => {
    const { team } = res.locals;
    let val: UserReturnData = new UserReturnData();
    const scouter: Scouter = { name: String(res.locals.name), id: String(res.locals.id), team: String(res.locals.team) };
    const clientInfo = await uuidAPIKey.create();
    val = await dbHandler.addKey(req.db, clientInfo.uuid, clientInfo.apiKey, team, scouter).catch((e) => { console.error(e); val.err_occur = true; });
    if (val.err_occur === false) {
      res.json({
        success: true,
        CLIENT_ID: clientInfo.uuid,
        CLIENT_SECRET: clientInfo.apiKey,
        team: req.body.team,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
    if (process.env.TRA_TESTING) {
      console.log("Running in testing environment, going to delete the API key we just made.");
      await dbHandler.deleteKey(req.db, clientInfo.uuid, clientInfo.apiKey, team, scouter).catch((e) => { console.error(e); });
    }
  });
};
