import UserReturnData from '../UserReturnData';

module.exports = async (db: any, competition: string, team: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_scouting');
  const myobj = { teams: { $all: [team] }, competition };
  try {
    data.data = await dbo.collection('matches').find(myobj).toArray();
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err.toString());
    console.error(err);
  }
  return data;
}
