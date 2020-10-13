import UserReturnData from '../UserReturnData';

export default async (db: any, compID: string, team: number): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('configs');
  const myobj = { competition: String(compID), team };
  try {
    data.data = await dbo.collection('match').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};
