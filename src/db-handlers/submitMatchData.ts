import UserReturnData from '../UserReturnData';

module.exports = async (db: any, scouter: Record<string, unknown>, competition: string, match: number, team_scouted: number, matchdata: Record<string, unknown>): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_scouting');
  const myobj = {
    $set: {
      scouter, competition, match, team_scouted, data: matchdata,
    },
  };
  dbo.collection('matchdata').updateOne({ _id: competition + match + team_scouted }, myobj, { upsert: true }).catch((e: string) => { console.error(e); data.err_occur = true; data.err_reasons.push(e); });
  return data;
};
