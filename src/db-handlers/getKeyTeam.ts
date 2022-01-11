import UserReturnData from '../UserReturnData';

export default async (db: any, CLIENT_ID: string): Promise<string> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('userlist');
  const myobj = { CLIENT_ID };
  data.data = await dbo.collection('api_keys').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; data.err_reasons.push(e); });
  try {
    return String(data.data.team);
  } catch {
    return null;
  }
};
