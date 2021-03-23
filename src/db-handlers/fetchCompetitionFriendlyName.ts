import UserReturnData from '../UserReturnData';
/**
 * @async
 * @memberof module:dbHandler
 * @desc Exchanges the competition identifier for the user-friendly competition name
 * @author Dev Singh <dsingh@imsa.edu>
 * @license BSD-3-Clause
 * @param db - instance of the DB object
 * @param {string} competition - FRC competition code
 * @returns {Promise<UserReturnData>} - See definition of UserReturnData
 * @see /api/fetchCompetitionFriendlyName endpoint
 */
export default async (db, competition: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_scouting');
  const myobj = { competition };
  data.data = await dbo.collection('complist').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; data.err_reasons.push(e); });
  if (data.data == null) {
    data.data = { friendlyName: '' }
  } else {
    // eslint-disable-next-line no-underscore-dangle
    data.data._id = undefined
    data.data.competition = undefined
  }
  return data;
};
