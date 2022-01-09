import Scouter from '../Scouter';
import UserReturnData from '../UserReturnData';

export default async (db: any, scouter: Scouter, match: string, competition: string, data: string): Promise<UserReturnData> => {
  const dataReturn: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('strategies');
  const myobj = {
    $set: {
      scouter, competition, match, data, owner: scouter.team,
    },
  };
  try {
    if (data === ' ') {
      await dbo.collection('data').deleteOne({ scouter, match, competition });
    } else {
      await dbo.collection('data').updateOne({ scouter, match, competition }, myobj, { upsert: true });
    }
  } catch (err) {
    dataReturn.err_occur = true;
    dataReturn.err_reasons.push(err);
    console.error(err);
  }
  return dataReturn;
};
