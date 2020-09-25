import UserReturnData from '../routes/UserReturnData';

export default async (db: any, competition: string, match: number, team_scouted: number): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_scouting');
  // var myobj = {_id: compIdIn + teamScoutedIn + matchNumberIn};
  const myobj = { competition, match, team_scouted };
  try {
    data.data = await dbo.collection('shotchart').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};
