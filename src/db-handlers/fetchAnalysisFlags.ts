import UserReturnData from '../UserReturnData';

export default async (db: any): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_processing');
  try {
    data.data = await dbo.collection('flags').findOne().catch((e) => { console.error(e); data.err_occur = true; throw new Error('Database error'); });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err.toString());
    console.error(err);
  }
  return data;
};
