import UserReturnData from '../routes/UserReturnData';

export default async (db: any, competition: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: { competition: undefined, data: undefined } };
  const dbo = db.db('data_scouting');
  const myobj = { competition };
  let interim = null;
  try {
    interim = await dbo.collection('matches').find(myobj).toArray().catch((e) => { data.err_occur = true; data.err_reasons.push(e); console.error(e); });
    data.data.competition = competition;
    data.data.data = [];
    for (const m of interim) {
      let numScouters = 0;
      for (let i = 0; i < 6; i += 1) {
        if (String(typeof (m.scouters[i])) !== 'boolean') {
          numScouters += 1;
        }
      }
      data.data.data[m.match - 1] = numScouters;
    }
  } catch (err) {
    data.err_occur = true;
    console.error(err);
  }
  return data;
};
