import UserReturnData from '../../UserReturnData';

export default async (db: any, competition: string, team_num: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_scouting');
  const myobj = { "competition": competition, "team_scouted": team_num };
  try {
    data.data = await dbo.collection('pitdata').find_one(myobj);
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
}
