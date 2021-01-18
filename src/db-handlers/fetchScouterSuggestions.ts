import UserReturnData from '../UserReturnData';

export default async (db: any, competition: string, match: number): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_scouting');
  const myobj = { competition, match };
  try {
    const out = [];
    const toProcess = await dbo.collection('matchdata').find(myobj).toArray().catch((e) => { console.error(e); data.err_occur = true; });
    for (const scoutSub of toProcess) {
      if (scoutSub.data['strategy-notes']) {
        out.push({ team_scouted: scoutSub.team_scouted, scouter: scoutSub.scouter.name, strategy: scoutSub.data['strategy-notes'] });
      }
    }
    data.data = out;
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};
