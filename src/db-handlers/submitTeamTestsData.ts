import UserReturnData from '../UserReturnData';

export default async (db: any, team_number: number, competition: string, data: Record<string, any>): Promise<UserReturnData> => {
  const dataReturn: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_processing');
  const myobj = {
    $set: {
      team_number, competition, data,
    },
  };
  try {
    await dbo.collection('team_tests').updateOne({
      _id: `${competition + team_number}am`, competition, team: team_number, data,
    }, myobj, { upsert: true });
  } catch (err) {
    dataReturn.err_occur = true;
    dataReturn.err_reasons.push(err);
    console.error(err);
  }
  return dataReturn;
};
