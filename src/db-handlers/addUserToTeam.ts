import UserReturnData from '../routes/UserReturnData';

export default async (db: any, id: string, name: string, team: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('userlist');
  const myobj: Record<string, Record<string, string>> = {
    $set: {
      id, name, team,
    },
  };
  try {
    await dbo.collection('data').updateOne({ _id: id }, myobj, { upsert: true });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};
