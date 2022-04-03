import Scouter from '../Scouter';
import UserReturnData from '../UserReturnData';
import getMatchTimes from '../tba-handlers/getMatchTimes';
/**
 * @async
 * @memberof module:dbHandler
 * @desc Fetches the competition schedule for a competition, including registered scouters
 * @author Dev Singh <dsingh@imsa.edu>
 * @license BSD-3-Clause
 * @param db - instance of the DB object
 * @param redisClient - instance of the redisClient object
 * @param {string} competition - FRC competition code
 * @returns {Promise<UserReturnData>} - See definition of UserReturnData
 * @see /api/fetchCompetitionSchedule endpoint
 */
export default async (db: any, redisClient, competition: string, scouter: Scouter): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_scouting');
  try {
    data.data = await dbo.collection('matches').find({ competition, owner: scouter.team }).project({
      _id: 0, match: 1, scouters: 1, teams: 1,
    }).toArray();
    const redisEnable = process.env.REDIS
    let redisCache = false;
    let matchTimes;
    if (!redisEnable) {
      try {
        redisCache = JSON.parse(await redisClient.get(`${competition}_getMatchTimes`));
      } catch (err) {
        console.error('Error pulling match times from cache.', err)
        redisCache = undefined;
      }
    } else {
      console.warn('WARNING: redis is disabled (fetchCompetitionSchedule).')
    }
    if (redisCache) {
      matchTimes = redisCache
    } else {  
      matchTimes = await getMatchTimes(redisClient, competition);
      redisClient.set(`${competition}_getMatchTimes`, JSON.stringify(matchTimes), 'EX', 60); // store in cache for 60 seconds
    }
    data.data.sort(function(a, b) {
      return parseInt(a.match) - parseInt(b.match);
    });
    data.data.map((x) => {
      x.time = matchTimes.data[x.match.toString()] // eslint-disable-line
      return x;
    })
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err.toString());
    console.error(err);
  }
  return data;
};
