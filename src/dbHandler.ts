/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/order */
import UserReturnData from './routes/UserReturnData';

export { default as addKey } from './db-handlers/addKey';
export { default as addUserToTeam } from './db-handlers/addUserToTeam';
export { default as getUserTeam } from './db-handlers/getUserTeam';
export { default as checkKey } from './db-handlers/checkKey';
export { default as submitMatchData } from './db-handlers/submitMatchData';
export { default as submitShotChartData } from './db-handlers/submitShotChartData';
export { default as fetchMatchesForCompetition } from './db-handlers/fetchMatchesForCompetition';
export { default as fetchAllTeamNicknamesAtCompetition } from './db-handlers/fetchAllTeamNicknamesAtCompetition';
export { default as findTeamNickname } from './db-handlers/findTeamNickname';
export { default as fetchMatchData } from './db-handlers/fetchMatchData';
export { default as fetchCompetitionSchedule } from './db-handlers/fetchCompetitionSchedule';
export { default as fetch2022Schedule } from './db-handlers/fetch2022Schedule';
export { default as fetchShotChartData } from './db-handlers/fetchShotChartData';
export { default as fetchScouterUIDs } from './db-handlers/fetchScouterUIDs';
export { default as fetchScouterSuggestions } from './db-handlers/fetchScouterSuggestions';
export { default as addScouterToMatch } from './db-handlers/addScouterToMatch';

export const removeScouterFromMatch = async (db, userin, matchin, teamScouted): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };

  const dbo = db.db('data_scouting');
  const myobj = { match: parseInt(matchin, 10) };
  try {
    const interim = await dbo.collection('matches').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; });
    const index = interim.teams.indexOf(String(teamScouted));
    if (index < 0) {
      console.error('Does not exist');
      data.err_occur = true;
      data.err_reasons.push('Team does not exist in scout schedule');
    }
    interim.scouters[index] = false;
    await dbo.collection('matches').findOneAndReplace(myobj, interim, { upsert: true }).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

export const submitStrategy = async (db, scouterin, matchin, compin, datain) => {
  const data = { err_occur: false, err_reasons: [], data: {} };

  const dbo = db.db('strategies');
  const myobj = {
    $set: {
      scouter: scouterin, competition: compin, match: matchin, data: datain,
    },
  };
  try {
    await dbo.collection('data').updateOne({ _id: compin + scouterin + matchin }, myobj, { upsert: true });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

export const fetchStrategy = async (db, compIdIn, matchIdIn) => {
  const data = { err_occur: false, err_reasons: [], data: {} };

  const dbo = db.db('strategies');
  const myobj = { competition: String(compIdIn), match: String(matchIdIn) };
  try {
    data.data = await dbo.collection('data').find(myobj).toArray();
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

export const fetchUserStrategy = async (db, compIdIn, matchIdIn, namein) => {
  const data = { err_occur: false, err_reasons: [], data: {} };

  const dbo = db.db('strategies');
  const myobj = { competition: String(compIdIn), match: String(matchIdIn), scouter: String(namein) };
  try {
    data.data = await dbo.collection('data').find(myobj).toArray();
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

export const submitPitData = async (db, scouterin, competitionin, matchin, teamin, datain) => {
  const data = { err_occur: false, err_reasons: [], data: {} };

  const dbo = db.db('data_scouting');
  const myobj = {
    $set: {
      scouter: scouterin, competition: competitionin, match: matchin, team_scouted: teamin, data: datain,
    },
  };
  try {
    await dbo.collection('pitdata').updateOne({ _id: competitionin + matchin + teamin }, myobj, { upsert: true }).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

export const fetchPitData = async (db, compIdIn, matchNumberIn, teamScoutedIn) => {
  const data = { err_occur: false, err_reasons: [], data: {} };

  const dbo = db.db('data_scouting');
  // var myobj = {_id: compIdIn + teamScoutedIn + matchNumberIn};
  const myobj = { competition: String(compIdIn), match: parseInt(matchNumberIn, 10), team_scouted: parseInt(teamScoutedIn, 10) };
  try {
    data.data = await dbo.collection('pitdata').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};
// export const getCompetitions = async (db, idin) => {
//     let rval;
//     idin = String(idin)
//     // Get the competitions for a team member. Currently, one user can only be part of one team.
//     var dbo = db.db("data_scouting");
//     var myobj = { id: idin};
//     var data = await dbo.collection("userlist").findOne(myobj)
//     return rval
// }

// const globalCompetition = '2020ilch';
