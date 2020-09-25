import UserReturnData from '../routes/UserReturnData';

export default async (db: any, competition: string, match: number): Promise<UserReturnData> => {
  const data: UserReturnData = {
    err_occur: false, err_reasons: [], data: {}, scouters: [], teams: [],
  };
  const dbo = db.db('data_scouting');
  const myobj = { competition, match };
  try {
    const matchdata = await dbo.collection('matches').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; });
    data.scouters = matchdata.scouters;
    data.teams = matchdata.teams;
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};
