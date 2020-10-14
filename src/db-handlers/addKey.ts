import * as bcrypt from 'bcrypt';
import UserReturnData from '../routes/UserReturnData';

export default async (db: any, clientID: string, clientKey: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('userlist');
  const hashedClientKey = bcrypt.hashSync(clientKey, 12);
  const myobj = {
    $set: {
      clientID, hashedClientKey,
    },
  };
  await dbo.collection('api_keys').updateOne({ _id: clientID }, myobj, { upsert: true }).catch((e) => { console.error(e); data.err_reasons.push(e); data.err_occur = true; });
  return data;
};
