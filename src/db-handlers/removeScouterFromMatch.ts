import UserReturnData from '../UserReturnData';

export default async (db: any, match: number, teamScouted: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };

  const dbo = db.db('data_scouting');
  const myobj = { match };
  try {
    const interim = await dbo.collection('matches').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; });
    const index = interim.teams.indexOf(teamScouted);
    if (index < 0) {
      console.error('Does not exist');
      data.err_occur = true;
      data.err_reasons.push('Team does not exist in scout schedule');
    }
    interim.scouters[index] = false;
    await dbo.collection('matches').findOneAndReplace(myobj, interim, { upsert: true }).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};
