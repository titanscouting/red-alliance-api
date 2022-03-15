import UserReturnData from '../UserReturnData';
import Scouter from '../Scouter';

export default async (db: any, scouter: Scouter, competition: string, team_scouted: string, datain: Record<string, any>): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_scouting');
  const myobj = {
    $set: {
      scouter, competition, team_scouted, data: datain, owner: scouter.team,
    },
  };
  try {
    await dbo.collection('pitdata').updateOne({ _id: competition + team_scouted }, myobj, { upsert: true }).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err.toString());
    console.error(err);
  }
  return data;
};
