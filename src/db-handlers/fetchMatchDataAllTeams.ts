import UserReturnData from '../UserReturnData';

export default async (db: any, compID: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_scouting');
  const myobj = { competition: String(compID) };
  try {
    const out = {};
    const teamsSeen = [];
    const toProcess = await dbo.collection('matchdata').find(myobj).toArray();
    for (const element of toProcess) {
      //  console.log(element);
      if (teamsSeen.indexOf(element.team_scouted) === -1) {
        console.log('not previously seen team');
        out[`${element.team_scouted}`] = [];
        teamsSeen.push(element.team_scouted);
      }
      console.log(element.team_scouted, element.match)
      out[`${element.team_scouted}`].push({ data: toProcess.data, match: toProcess.match })
      // for (const group of toProcess) {
      //   if (element.team_scouted === group.team_scouted) {
      //     out.push({ teamNum: { matchNum: element.match, data: element.data } });
      //   }
      // }
    }
    data.data = out;
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }

  return data;
};
