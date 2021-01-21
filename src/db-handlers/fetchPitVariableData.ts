import UserReturnData from '../UserReturnData';

export default async (db: any, compID: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_processing');
  const myobj = { competition: String(compID) };
  try {
    data.data = await dbo.collection('team_pit').find(myobj).toArray();
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};
