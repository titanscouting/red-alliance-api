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
  if (json['Error'] || json.length == 0) {return data}
  json = json.filter((x) => {return x.comp_level = 'qm' && x.key.includes('qm')}) // eslint-disable-line
  const json2 = {}
  for (const x of json) {
    const time = new Date((x.actual_time !== null ? x.actual_time : x.predicted_time) * 1000);
    json2[parseInt(x.match_number)] = time
  }
  data.data = json2;
  return data;
};
