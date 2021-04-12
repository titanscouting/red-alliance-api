import UserReturnData from '../UserReturnData';

export default async (db: any, team: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('teamlist');
  const myobj = { team: team.toString() };
  await dbo.collection('competitions').findOne(myobj).then((value: any) => {
    data.data = value.currentCompetition;
  }).catch((e: string) => {
    data.err_occur = true;
    data.err_reasons.push(e);
  });
  return data;
};
