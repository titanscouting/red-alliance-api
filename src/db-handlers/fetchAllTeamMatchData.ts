import Scouter from '../Scouter';
import UserReturnData from '../UserReturnData';

export default async (db: any, compID: string, teamScouted: string, scouter: Scouter): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_scouting');
  let myobj;
  if (teamScouted) {
    myobj = { competition: String(compID), team_scouted: String(teamScouted), owner: scouter.team };
  } else {
    myobj = { competition: String(compID), owner: scouter.team };
  }
  try {
    const out = {};
    const teamsSeen = [];
    const toProcess = await dbo.collection('matchdata').find(myobj).toArray();
    for (const element of toProcess) {
      if (teamsSeen.indexOf(element.team_scouted) === -1) {
        out[`${element.team_scouted}`] = {};
        teamsSeen.push(element.team_scouted);
      }
      out[`${element.team_scouted}`][`${element.match}`] = element.data;
    }
    data.data = out;
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err.toString());
    console.error(err);
  }

  return data;
};
