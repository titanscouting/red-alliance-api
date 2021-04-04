import UserReturnData from '../UserReturnData';
/**
 * @async
 * @memberof module:dbHandler
 * @desc Registers the given user as the scouter for a given match and a team at a given competition
 * @author Dev Singh <dsingh@imsa.edu>
 * @license BSD-3-Clause
 * @param db - instance of the DB object
 * @param {string} id - User's Google ID
 * @param {string} name - User's first and last name
 * @param {number} match - FRC match number
 * @param {string} teamScouted - Scouted team's FRC team number
 * @returns {Promise<UserReturnData>} - See definition of UserReturnData
 * @see /api/addScouterToMatch endpoint
 */
export default async (db: any, id: string, name: string, match: number, teamScouted: string, competition: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_scouting');
  const myobj = { match, competition };
  try {
    const interim = await dbo.collection('matches').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; });
    const index = interim.teams.indexOf(teamScouted);
    if (index < 0) {
      data.err_occur = true;
      data.err_reasons.push('Team does not exist in scout schedule');
    }
    interim.scouters[index] = { name, id };
    await dbo.collection('matches').findOneAndReplace(myobj, interim, { upsert: true }).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err.toString());
    console.error(err);
  }
  return data;
};
