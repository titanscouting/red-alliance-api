import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

module.exports = (app:any, auth: any) => {
  app.get('/api/checkUserTeam', auth.checkAuth, async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const { id, team, name } = res.locals;
    if (!(team)) {
      val.err_occur = true;
      val.err_reasons.push('User team not known.');
    }
    if (val.err_occur === false) {
      res.json({
        success: true,
        id,
        team,
        name,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  })
}
