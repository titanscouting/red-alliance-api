import UserReturnData from '../routes/UserReturnData';

export default async (db, scouter, competition, match, team_scouted, datain): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_scouting');
  const myobj = {
    $set: {
      scouter, competition, match, team_scouted, data: datain,
    },
  };
  await dbo.collection('shotchart').updateOne({ _id: competition + match + team_scouted }, myobj, { upsert: true }).catch((e) => { console.error(e); data.err_reasons.push(e); data.err_occur = true; });
  return data;
};
