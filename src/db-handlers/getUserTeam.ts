import UserReturnData from '../UserReturnData';

export default async (db: any, id: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('userlist');
  const myobj = { id };
  data.data = await dbo.collection('data').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; data.err_reasons.push(e); });
  try {
    return data.data.team;
  } catch {
    return null;
  }
  
};
