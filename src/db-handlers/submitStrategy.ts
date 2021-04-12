import Scouter from '../Scouter';
import UserReturnData from '../UserReturnData';

module.exports = async (db: any, scouter: Scouter, match: string, competition: string, data: string): Promise<UserReturnData> => {
  const dataReturn: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('strategies');
  const myobj = {
    $set: {
      scouter, competition, match, data,
    },
  };
  try {
    await dbo.collection('data').updateOne({ _id: competition + scouter.id + match }, myobj, { upsert: true });
  } catch (err) {
    dataReturn.err_occur = true;
    dataReturn.err_reasons.push(err);
    console.error(err);
  }
  return dataReturn;
};
