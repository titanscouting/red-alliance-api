import UserReturnData from '../UserReturnData';

export default async (db: any, competition: string, team: number): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_processing');
  const myobj = { competition, team };
  try {
    data.data = await dbo.collection('team_tests').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; throw new Error('Database error'); });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};
