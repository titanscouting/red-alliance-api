import * as bcrypt from 'bcrypt';
import UserReturnData from '../UserReturnData';
/**
 * @async
 * @memberof module:dbHandler
 * @desc Hashes and adds an API key to the database
 * @author Dev Singh <dsingh@imsa.edu>
 * @license BSD-3-Clause
 * @param db - instance of the DB object
 * @param {string} clientID - Client ID issued to user
 * @param {string} clientKey - Client secret issued to user
 * @returns {Promise<UserReturnData>} - See definition of UserReturnData
 * @see /api/addAPIKey endpoint
 */

export default async (db: any, clientID: string, clientKey: string, team: number): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('userlist');
  const hashedClientKey = await bcrypt.hash(clientKey, 12);
  const myobj = {
    $set: {
      clientID, hashedClientKey, team,
    },
  };
  await dbo.collection('api_keys').updateOne({ _id: clientID }, myobj, { upsert: true }).catch((e) => { console.error(e); data.err_reasons.push(e); data.err_occur = true; });
  const dbo2 = db.db('userlist');
  const myobj2 = {
    $set: {
      clientID, team,
    },
  };
  await dbo2.collection('data').updateOne({ _id: clientID }, myobj2, { upsert: true }).catch((e) => { console.error(e); data.err_reasons.push(e); data.err_occur = true; });
  return data;
};
