import UserReturnData from '../UserReturnData';
/**
 * @async
 * @memberof module:dbHandler
 * @desc Stores that the given user is a member of the given team
 * @author Dev Singh <dsingh@imsa.edu>
 * @license BSD-3-Clause
 * @param db - instance of the DB object
 * @param {string} id - User's Google ID
 * @param {string} name - User's first and last name
 * @param {string} team - User's home team
 * @returns {Promise<UserReturnData>} - See definition of UserReturnData
 * @see /api/addUserToTeam endpoint
 */
export default async (db: any, id: string, email: string, name: string, team: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('userlist');
  const myobj: Record<string, Record<string, string>> = {
    $set: {
      id, name, team,
    },
  };
  try {
    const teamAuthList = await db.db('teamlist').collection('competitions').findOne({ team });
    const { authorizedDomains, authorizedUsers } = teamAuthList;
    const userDomain = email.split('@').pop();
    if (!authorizedDomains.includes(userDomain) && !authorizedUsers.includes(email)) {
      if (email) { throw new Error(`Users from domain ${userDomain} are not authorized to join this team!`); }
    } else {
      await dbo.collection('data').updateOne({ _id: id }, myobj, { upsert: true });
    }
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err.toString());
    console.error(err);
  }
  return data;
};
