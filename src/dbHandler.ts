// Not implemented in this year's version of the API.
// export const addUserToTeam = (db, idin, namein, teamin) => {
//     idin = String(idin)
//     var dbo = db.db("userlist");
//     var myobj = { "$set": {_id: idin, id: idin, name: namein, team: teamin}};
//     dbo.collection("data").updateOne({_id: idin}, myobj, {upsert:true}).then(function(err, res) {
//         if (err) {
//             console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
//             errorcode = 1
//         }
//         console.log("1 document inserted");
//     });
// }

import { stringify } from "querystring";

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
const bcrypt = require('bcrypt');

export const addKey = async (db, clientID, clientKey) => {
  const data = {err_occur: false, err_reasons: [], data: {}}
  const dbo = db.db('userlist');
  const hashedClientKey = bcrypt.hashSync(clientKey, 12);
  const myobj = {
    $set: {
      clientID, hashedClientKey,
    },
  };
  try {
    await dbo.collection('api_keys').updateOne({ _id: clientID }, myobj, { upsert: true }).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

export const checkKey = async (db, clientID: string, clientKey: string) => {
  const data = {err_occur: false, err_reasons: [], data: {hashedClientKey: undefined}}
  const dbo = db.db('userlist');
  const myobj = { clientID };
  data.data = dbo.collection('api_keys').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; throw new Error('Database error'); });
  if (data.data == null) {
    data.data = { hashedClientKey: 'obvsnotrightlfojdslf2e980' };
  }
  const isAuthorized = bcrypt.compareSync(clientKey, data.data.hashedClientKey);
  return isAuthorized;
};

export const submitMatchData = async (db: any, scouter: object, competition: string, match: number, team_scouted: number, matchdata: object) => {
  const data = {err_occur: false, err_reasons: [], data: {}}
  const dbo = db.db('data_scouting');
  const myobj = { $set: { scouter, competition, match, team_scouted, data: matchdata, } };
  dbo.collection('matchdata').updateOne({ _id: competition + match + team_scouted }, myobj, { upsert: true }).catch((e) => { console.error(e); data.err_occur = true; data.err_reasons.push});
  return data;
};

export const submitShotChartData = async (db, scouter, competition, match, team_scouted, datain) => {
  const data = {err_occur: false, err_reasons: [], data: {}};
  const dbo = db.db('data_scouting');
  const myobj = {
    $set: {
      scouter, competition, match, team_scouted, data: datain,
    },
  };
  try {
    await dbo.collection('shotchart').updateOne({ _id: competition + match + team_scouted }, myobj, { upsert: true }).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

export const fetchMatchesForCompetition = async (db, compIdIn1) => {
  const data = {err_occur: false, err_reasons: [], data: {competition: undefined, data: undefined}}
  const compIdIn = String(compIdIn1);
  const dbo = db.db('data_scouting');
  const myobj = { competition: String(compIdIn) };
  let interim = null;
  try {
    interim = await dbo.collection('matches').find(myobj).toArray();
    data.data.competition = String(compIdIn);
    data.data.data = [];
    for (const m of interim) {
      let numScouters = 0;
      for (let i = 0; i < 6; i += 1) {
        if (String(typeof (m.scouters[i])) !== 'boolean') {
          numScouters += 1;
        }
      }
      data.data.data[m.match - 1] = numScouters;
    }
  } catch (err) {
    data.err_occur = true;
    console.error(err);
  }
  return data;
};


export const getNumberScouts = async (db, compIdIn1) => {
  const data = {err_occur: false, err_reasons: [], data: {}}

  const compIdIn = String(compIdIn1);
  const dbo = db.db('data_scouting');
  const myobj = { competition: String(compIdIn) };
  let inval;
  try {
    inval = await dbo.collection('schedule').findOne(myobj);
    data.data = inval.data.reduce((partialSum, a) => partialSum + a, 0);
  } catch (e) {
    data.err_occur = true;
    data.err_reasons.push(e);
    console.error(e);
  }
  return data;
};

export const fetchAllTeamNicknamesAtCompetition = async (db, compIdIn: string) => {
  const data = {err_occur: false, err_reasons: [], data: {}}
  const dbo = db.db('data_scouting');
  const myobj = { competition: String(compIdIn) };
  data.data = await dbo.collection('teamlist').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; data.err_reasons.push(e)});
  return data;
};

export const findTeamNickname = async (db, teamNumber: number) => {
  const data = {err_occur: false, err_reasons: [], data: {}}
  const dbo = db.db('data_scouting');
  const myobj = {};
  await dbo.collection('teamlist').findOne(myobj).then((value: any) => {
    data.data = value.teamNumber
  }).catch((e: string) => { 
    data.err_occur = true
    data.err_reasons.push(e)
  });
  return data;
};

export const fetchMatchData = async (db, compIdIn, matchNumberIn, teamScoutedIn) => {
  const data = {err_occur: false, err_reasons: [], data: {}}

  const dbo = db.db('data_scouting');
  // var myobj = {_id: compIdIn + teamScoutedIn + matchNumberIn};
  const myobj = { competition: String(compIdIn), match: parseInt(matchNumberIn, 10), team_scouted: parseInt(teamScoutedIn, 10) };
  try {
    data.data = await dbo.collection('matchdata').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; throw new Error('Database error'); });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

export const fetchCompetitionSchedule = async (db, compIdIn) => {
  const data = {err_occur: false, err_reasons: [], data: {}}

  const dbo = db.db('data_scouting');
  const passin = { competition: String(compIdIn) };
  try {
    data.data = await dbo.collection('matches').find(passin).toArray();
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

export const fetch2022Schedule = async (db, compIdIn) => {
  const data = {err_occur: false, err_reasons: [], data: {}}

  const dbo = db.db('data_scouting');
  const myobj = { teams: { $all: ['2022'] }, competition: String(compIdIn) };
  try {
    data.data = await dbo.collection('matches').find(myobj).toArray();
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

export const fetchShotChartData = async (db, compIdIn, matchNumberIn, teamScoutedIn) => {
  const data = {err_occur: false, err_reasons: [], data: {}}

  const dbo = db.db('data_scouting');
  // var myobj = {_id: compIdIn + teamScoutedIn + matchNumberIn};
  const myobj = { competition: String(compIdIn), match: parseInt(matchNumberIn, 10), team_scouted: parseInt(teamScoutedIn, 10) };
  try {
    data.data = await dbo.collection('shotchart').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};
export const fetchScouterSuggestions = async (db, compIdIn, matchNumberIn) => {
  const data = {err_occur: false, err_reasons: [], data: {}}

  const dbo = db.db('data_scouting');
  const myobj = { competition: String(compIdIn), match: parseInt(matchNumberIn, 10) };
  try {
    const out = [];
    const toProcess = await dbo.collection('matchdata').find(myobj).toArray().catch((e) => { console.error(e); data.err_occur = true; });
    for (const scoutSub of toProcess) {
      if (scoutSub.data['strategy-notes']) {
        out.push({ scouter: scoutSub.scouter.name, strategy: scoutSub.data['strategy-notes'] });
      }
    }
    data.data = out;
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

export const fetchScouterUIDs = async (db, competition, matchNumberIn) => {
  const data = {err_occur: false, err_reasons: [], data: {}, scouters: 0, teams: []}
  const dbo = db.db('data_scouting');
  const myobj = { competition, match: parseInt(matchNumberIn, 10) };
  try {
    const matchdata = await dbo.collection('matches').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; });
    data.scouters = matchdata.scouters;
    data.teams = matchdata.teams;
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

export const addScouterToMatch = async (db, userin, namein, matchin, teamScouted) => {
  const data = {err_occur: false, err_reasons: [], data: {}}
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
    interim.scouters[index] = { name: String(namein), id: String(userin) };
    await dbo.collection('matches').findOneAndReplace(myobj, interim, { upsert: true }).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

export const removeScouterFromMatch = async (db, userin, matchin, teamScouted) => {
  const data = {err_occur: false, err_reasons: [], data: {}}

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
  const data = {err_occur: false, err_reasons: [], data: {}}

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
  const data = {err_occur: false, err_reasons: [], data: {}}

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

export const getUserStrategy = async (db, compIdIn, matchIdIn, namein) => {
  const data = {err_occur: false, err_reasons: [], data: {}}

  const dbo = db.db('strategies');
  const myobj = { competition: String(compIdIn), match: String(matchIdIn), scouter: String(namein) };
  console.log(myobj);
  try {
    data.data = await dbo.collection('data').find(myobj).toArray();
    console.log(data.data);
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

export const submitPitData = async (db, scouterin, competitionin, matchin, teamin, datain) => {
  const data = {err_occur: false, err_reasons: [], data: {}}

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
  const data = {err_occur: false, err_reasons: [], data: {}}

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