import UserReturnData from '../UserReturnData';
/**
 * @async
 * @memberof module:dbHandler
 * @desc Fetches the match scouting config for a given team and competition
 * @author Dev Singh <dsingh@imsa.edu>
 * @license BSD-3-Clause
 * @param db - instance of the DB object
 * @param {string} competition - FRC competition code
 * @param {string} team - FRC team number of the tenant
 * @returns {Promise<UserReturnData>} - See definition of UserReturnData
 * @see /api/fetchMatchConfig endpoint
 */
export default async (db: any, competition: string, team: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('configs');
  const myobj = { competition, team };
  try {
    data.data = await dbo.collection('match').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};
