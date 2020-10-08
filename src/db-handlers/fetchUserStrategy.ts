import UserReturnData from '../UserReturnData';

export default async (db: any, competition: string, match: string, scouter: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };

  const dbo = db.db('strategies');
  const myobj = { competition, match, scouter };
  try {
    data.data = await dbo.collection('data').find(myobj).toArray();
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};
