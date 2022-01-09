import Scouter from '../Scouter';
import UserReturnData from '../UserReturnData';

export default async (db: any, competition: string, match: string, scouter: Scouter): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };

  const dbo = db.db('strategies');
  const myobj = { competition, match, owner: scouter.team };
  try {
    data.data = await dbo.collection('data').find(myobj).project({ scouter: 1, data: 1 }).toArray();
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err.toString());
    console.error(err);
  }
  return data;
};
