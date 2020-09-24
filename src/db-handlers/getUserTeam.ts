import UserReturnData from '../routes/UserReturnData';

export default async (db: any, id: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('userlist');
  const myobj = { id };
  data.data = await dbo.collection('associations').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; data.err_reasons.push(e); });
  return data;
};
