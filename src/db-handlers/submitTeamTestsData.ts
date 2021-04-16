import UserReturnData from '../UserReturnData';

export default async (db: any, team: number, competition: string, data: Record<string, any>): Promise<UserReturnData> => {
  const dataReturn: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_processing');
  const myobj = {
    $set: {
      team, competition, data,
    },
  };
  try {
    await dbo.collection('team_tests').updateOne({
      _id: competition + team, competition, team, data,
    }, myobj, { upsert: true });
  } catch (err) {
    dataReturn.err_occur = true;
    dataReturn.err_reasons.push(err);
    console.error(err);
  }
  return dataReturn;
};
