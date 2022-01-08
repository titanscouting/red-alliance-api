import UserReturnData from '../UserReturnData';
/**
 * @async
 * @memberof module:dbHandler
 * @desc Fetches a list of all FRC teams present at a competition
 * @author Dev Singh <dsingh@imsa.edu>
 * @license BSD-3-Clause
 * @param db - instance of the DB object
 * @param {string} competition - FRC competition code
 * @returns {Promise<UserReturnData>} - See definition of UserReturnData
 * @see /api/fetchAllTeamNicknamesAtCompetition endpoint
 */
export default async (db, competition: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('teamlist');
  const dbo2 = db.db('data_scouting');
  const interim = await dbo2.collection('matches').find({ competition }).project({ _id: 0, teams: 1 }).toArray()
    .catch((e) => { data.err_occur = true; data.err_reasons.push(e); console.error(e); });
  let teams = interim.map((x) => x.teams).flat();
  teams = teams.filter((item, pos) => teams.indexOf(item) === pos)
  data.data = {}
  const allTeams = await dbo.collection('nicknames').findOne({}).catch((e) => { console.error(e); data.err_occur = true; data.err_reasons.push(e); });
  const arrTeamsAtComp = Object.entries(allTeams).filter(([key]) => teams.indexOf(key) !== -1);
  for (const team of arrTeamsAtComp) {
    const [key, value] = team
    data.data[key] = value;
  }
  return data;
};
