import fetch from 'node-fetch';
import UserReturnData from '../UserReturnData';

/**
 * @async
 * @memberof module:tbaHandler
 * @desc Gets match times for a given competition
 * @author Dev Singh <dsingh@imsa.edu>
 * @license BSD-3-Clause
 * @param {string} competition - FRC competition code
 * @returns {Promise<UserReturnData>} - See definition of UserReturnData
 * @see /api/fetchCompetitionSchedule endpoint
 */
export default async (redisClient: any, competition: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const headers = { 'X-TBA-Auth-Key': process.env.TBA_KEY }
  const matchTimes = await fetch(`https://www.thebluealliance.com/api/v3/event/${competition}/matches/simple`, { headers })
  let json = await matchTimes.json()
  json = json.filter((x) => x.comp_level = 'qm') // eslint-disable-line
  const json2 = {}
  json.map((x) => {
    const time = new Date((x.actual_time !== null ? x.actual_time : x.predicted_time) * 1000);
    const match = x.match_number
    json2[match.toString()] = time
    return null
  })
  data.data = json2;
  return data;
};
