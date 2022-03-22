import Scouter from '../Scouter';
import UserReturnData from '../UserReturnData';
/**
 * @async
 * @memberof module:dbHandler
 * @desc Add a match to a given competition
 * @author Dev Singh <dsingh@imsa.edu>
 * @license BSD-3-Clause
 * @param db - instance of the DB object
 * @param {Scouter} scouter - Authenticated user
 * @param {number} match - match number
 * @param {string} competition - competition ID
 * @param {Array<string>} teams - list of teams competing in match
 * @returns {Promise<UserReturnData>} - See definition of UserReturnData
 * @see /api/addMatchToCompetition endpoint
 */
export default async (db: any, scouter: Scouter, match: number, competition: string, teams: Array<string>): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_scouting');
  const scouters = [false, false, false, false, false, false]
  const myobj = {
    match, teams, scouters, competition, owner: scouter.team,
  };
  try {
    await dbo.collection('matches').findOne(myobj, { upsert: true }).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err.toString());
    console.error(err);
  }
  return data;
};
