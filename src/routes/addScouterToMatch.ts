import UserReturnData from './UserReturnData'

module.exports =(app:any, dbHandler:any, auth: any) => {
  app.post('/api/addScouterToMatch', auth.checkAuth, async (req: any, res:any) => {
    let val: UserReturnData =  new UserReturnData();
    const match = String(req.body.match);
    const user = parseInt(res.locals.id, 10);
    const teamScouted = parseInt(req.body.team_scouting, 10);
    const userName = String(res.locals.name);
    try {
      val.data = await dbHandler.addScouterToMatch(req.db, user, userName, match, teamScouted).catch((e) => { console.error(e); val.err_occur = true; });
    } catch (err) {
      console.error(err);
      val.err_occur = true;
    }
    let resobj = null;
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
    res.json(resobj);
  });   
}
