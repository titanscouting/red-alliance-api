import UserReturnData from '../UserReturnData';

module.exports = async (db: any, compID: string, team: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_processing');
  const myobj = { competition: String(compID), team: parseInt(team, 10) };
  try {
    data.data = await dbo.collection('team_metrics').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; throw new Error('Database error'); });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err.toString());
    console.error(err);
  }
  return data;
};
