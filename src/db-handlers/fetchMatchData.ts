import UserReturnData from '../UserReturnData';

export default async (db: any, competition: string, matchNum: string, teamScouted: string, scouter: Record<string, any>): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_scouting');
  const myobj = {
    competition, match: parseInt(matchNum, 10), team_scouted: String(teamScouted), owner: scouter.team,
  };
  try {
    data.data = await dbo.collection('matchdata').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; throw new Error('Database error'); });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err.toString());
    console.error(err);
  }
  return data;
};
