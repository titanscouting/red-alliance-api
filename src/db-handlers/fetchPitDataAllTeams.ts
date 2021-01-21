import UserReturnData from '../UserReturnData';

export default async (db: any, compID: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_scouting');
  const myobj = { competition: String(compID) };
  try {
    const out = {};
    const teamsSeen = [];
    const toProcess = await dbo.collection('pitdata').find(myobj).toArray();
    for (const element of toProcess) {
      if (teamsSeen.indexOf(element.team_scouted) === -1) {
        out[`${element.team_scouted}`] = {};
        teamsSeen.push(element.team_scouted);
      }
      out[`${element.team_scouted}`] = element.data;
    }
    data.data = out;
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};
