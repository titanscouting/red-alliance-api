import UserReturnData from '../UserReturnData';

export default async (db: any, compID: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_scouting');
  const myobj = { competition: String(compID) };
  try {
    const out = [];
    const toProcess = await dbo.collection('matchdata').find(myobj).toArray();
    // console.log(toProcess.data.match)
    //  console.log(toProcess.data["team_scouted"]);
    for (const element of toProcess) {
      //  console.log(element);
      for (const group of toProcess) {
        //  const temp = { teamNum: { matchNum: 0, data: null } };
        if (element.team_scouted === group.team_scouted) {
          //  console.log(true);
          out.push({ teamNum: { matchNum: element.match, data: element.data } });
        }
      }
    }
    data.data = out;
    console.log(out);
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }

  return data;
};
