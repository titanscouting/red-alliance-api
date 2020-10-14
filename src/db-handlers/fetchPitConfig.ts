import UserReturnData from '../routes/UserReturnData';

export default async (db: any, competition: string, team: number): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('configs');
  const myobj = { competition, team };
  try {
    data.data = await dbo.collection('pit').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};
