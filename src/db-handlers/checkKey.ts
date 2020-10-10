import * as bcrypt from 'bcrypt';
import UserReturnData from '../routes/UserReturnData';

export default async (db, clientID: string, clientKey: string): Promise<boolean> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('userlist');
  const myobj = { clientID };
  await dbo.collection('api_keys').findOne(myobj).then((value: any) => {
    data.data = value.hashedClientKey;
  }).catch((e: string) => {
    data.err_occur = true;
    data.err_reasons.push(e);
  });
  return bcrypt.compareSync(clientKey, data.data);
};
