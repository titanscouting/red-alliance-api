import UserReturnData from '../UserReturnData';

export default async (db: any, teamNumber: number): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('teamlist');
  const myobj = { team_num: { $exists: true } };
  await dbo.collection('nicknames').findOne(myobj).then((value: any) => {
    data.data = value[teamNumber];
  }).catch((e: string) => {
    data.err_occur = true;
    data.err_reasons.push(e);
  });
  return data;
};
