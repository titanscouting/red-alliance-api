import UserReturnData from '../routes/UserReturnData';

export default async (db, compIdIn: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_scouting');
  const myobj = { competition: String(compIdIn) };
  data.data = await dbo.collection('teamlist').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; data.err_reasons.push(e); });
  return data;
};
