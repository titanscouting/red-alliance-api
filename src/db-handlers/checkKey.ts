import * as bcrypt from 'bcrypt';
import UserReturnData from '../UserReturnData';
/**
 * @async
 * @memberof module:dbHandler
 * @desc Check whether the given client ID and secret is currently valid. Currently used in the auth handler flow.
 * @author Dev Singh <dsingh@imsa.edu>
 * @license BSD-3-Clause
 * @param db - instance of the DB object
 * @param {string} clientID - Client ID issued to user
 * @param {string} clientKey - Client secret issued to user
 * @returns {Promise<UserReturnData>} - See definition of UserReturnData
 * @see authHandler.ts
 */
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
  const isAuth = await bcrypt.compare(clientKey, data.data).catch(() => false);
  return isAuth
};
