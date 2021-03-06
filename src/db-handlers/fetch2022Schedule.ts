import UserReturnData from '../UserReturnData';
/**
 * @async
 * @memberof module:dbHandler
 * @desc Fetches the competition Schedule for FRC team 2022
 * @author Dev Singh <dsingh@imsa.edu>
 * @license BSD-3-Clause
 * @param db - instance of the DB object
 * @param {string} competition - FRC competition code
 * @returns {Promise<UserReturnData>} - See definition of UserReturnData
 * @see /api/fetch2022Schedule endpoint
 */
export default async (db: any, competition: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_scouting');
  const myobj = { teams: { $all: ['2022'] }, competition };
  try {
    data.data = await dbo.collection('matches').find(myobj).toArray();
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
}
