// Not implemented in this year's version of the API.
// exports.addUserToTeam = (db, idin, namein, teamin) => {
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

// exports.getCompetitions = async (db, idin) => {
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

exports.addKey = async (db, clientID, clientKey) => {
  const data = {};
  data.err_occur = false;
  data.err_reasons = [];
  const dbo = db.db('userlist');
  let hashedClientKey;
  await bcrypt.hash(clientKey, 12, (err, hash) => {
    if (err) {
      data.err_occur = true;
      data.err_reasons.push(err);
      console.error(err);
    } else {
      hashedClientKey = hash;
    }
  });
  const myobj = {
    $set: {
      clientID, hashedClientKey,
    },
  };
  try {
    await dbo.collection('api_e').updateOne({ _id: clientID }, myobj, { upsert: true }).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

exports.checkKey = async (db, clientID, clientKey) => {
  const data = {};
  data.err_occur = false;
  data.err_reasons = [];
  const dbo = db.db('userlist');
  const myobj = { clientID };
  try {
    data.data = await dbo.collection('api_keys').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; throw new Error('Database error'); });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return bcrypt.compareSync(clientKey, data.data.hashedClientKey);
};

exports.submitMatchData = async (db, scouterin, competitionin, matchin, teamin, datain) => {
  const data = {};
  data.err_occur = false;
  data.err_reasons = [];
  const dbo = db.db('data_scouting');
  const myobj = {
    $set: {
      scouter: scouterin, competition: competitionin, match: matchin, teamScouted: teamin, data: datain,
    },
  };
  try {
    await dbo.collection('matchdata').updateOne({ _id: competitionin + matchin + teamin }, myobj, { upsert: true }).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

exports.submitShotChartData = async (db, scouterin, competitionin, matchin, teamin, datain) => {
  const data = {};
  data.err_occur = false;
  data.err_reasons = [];
  const dbo = db.db('data_scouting');
  const myobj = {
    $set: {
      scouter: scouterin, competition: competitionin, match: matchin, teamScouted: teamin, data: datain,
    },
  };
  try {
    await dbo.collection('shotchart').updateOne({ _id: competitionin + matchin + teamin }, myobj, { upsert: true }).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

exports.fetchMatchesForCompetition = async (db, compIdIn1) => {
  const data = {};
  data.err_occur = false;
  data.err_reason = [];
  const compIdIn = String(compIdIn1);
  const dbo = db.db('data_scouting');
  const myobj = { competition: String(compIdIn) };
  let interim = null;
  try {
    data.data = [];
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


exports.getNumberScouts = async (db, compIdIn1) => {
  const data = {};
  data.err_occur = false;
  data.err_reasons = [];
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


exports.fetchAllTeamNicknamesAtCompetition = async (db, compIdIn1) => {
  const data = {};
  data.err_occur = false;
  data.err_reason = [];
  const compIdIn = String(compIdIn1);
  const dbo = db.db('data_scouting');
  const myobj = { competition: String(compIdIn) };
  try {
    data.data = await dbo.collection('teamlist').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

exports.findTeamNickname = async (db, teamNumber) => {
  const data = {};
  data.err_occur = false;
  data.err_reason = [];
  const dbo = db.db('data_scouting');
  const myobj = { teamNumber: { $exists: true } };
  try {
    const teamlist = await dbo.collection('teamlist').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; });
    data.data = teamlist[teamNumber];
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

exports.fetchMatchData = async (db, compIdIn, matchNumberIn, teamScoutedIn) => {
  const data = {};
  data.err_occur = false;
  data.err_reasons = [];
  const dbo = db.db('data_scouting');
  // var myobj = {_id: compIdIn + teamScoutedIn + matchNumberIn};
  const myobj = { competition: String(compIdIn), match: parseInt(matchNumberIn, 10), teamScouted: parseInt(teamScoutedIn, 10) };
  try {
    data.data = await dbo.collection('matchdata').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; throw new Error('Database error'); });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

exports.fetchCompetitionSchedule = async (db, compIdIn) => {
  const data = {};
  data.err_occur = false;
  data.err_reasons = [];
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

exports.fetch2022Schedule = async (db, compIdIn) => {
  const data = {};
  data.err_occur = false;
  data.err_reasons = [];
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

exports.fetchShotChartData = async (db, compIdIn, matchNumberIn, teamScoutedIn) => {
  const data = {};
  data.err_occur = false;
  data.err_reasons = [];
  const dbo = db.db('data_scouting');
  // var myobj = {_id: compIdIn + teamScoutedIn + matchNumberIn};
  const myobj = { competition: String(compIdIn), match: parseInt(matchNumberIn, 10), teamScouted: parseInt(teamScoutedIn, 10) };
  try {
    data.data = await dbo.collection('shotchart').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};
exports.fetchScouterSuggestions = async (db, compIdIn, matchNumberIn) => {
  const data = {};
  data.err_occur = false;
  data.err_reasons = [];
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

exports.fetchScouterUIDs = async (db, competition, matchNumberIn) => {
  const data = {};
  data.err_occur = false;
  data.err_reason = [];
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

exports.addScouterToMatch = async (db, userin, namein, matchin, teamScouted) => {
  const data = {};
  data.err_occur = false;
  data.err_reasons = [];
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

exports.removeScouterFromMatch = async (db, userin, matchin, teamScouted) => {
  const data = {};
  data.err_occur = false;
  data.err_reasons = [];
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

exports.getDataOnTeam = async (db, teamin, compin) => {
  const data = {};
  data.err_occur = false;
  data.err_reasons = [];
  const dbo = db.db('data_scouting');
  const myobj = { teamScouted: parseInt(teamin, 10), competition: String(compin) };
  try {
    data.data = await dbo.collection('matchdata').find(myobj).toArray();
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};

exports.submitStrategy = async (db, scouterin, matchin, compin, datain) => {
  const data = {};
  data.err_occur = false;
  data.err_reasons = [];
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

exports.fetchStrategy = async (db, compIdIn, matchIdIn) => {
  const data = {};
  data.err_occur = false;
  data.err_reasons = [];
  const dbo = db.db('strategies');
  const myobj = { competition: String(compIdIn), match: String(matchIdIn) };
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

exports.getUserStrategy = async (db, compIdIn, matchIdIn, namein) => {
  const data = {};
  data.err_occur = false;
  data.err_reasons = [];
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

exports.submitPitData = async (db, scouterin, competitionin, matchin, teamin, datain) => {
  const data = {};
  data.err_occur = false;
  data.err_reasons = [];
  const dbo = db.db('data_scouting');
  const myobj = {
    $set: {
      scouter: scouterin, competition: competitionin, match: matchin, teamScouted: teamin, data: datain,
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

exports.fetchPitData = async (db, compIdIn, matchNumberIn, teamScoutedIn) => {
  const data = {};
  data.err_occur = false;
  data.err_reasons = [];
  const dbo = db.db('data_scouting');
  // var myobj = {_id: compIdIn + teamScoutedIn + matchNumberIn};
  const myobj = { competition: String(compIdIn), match: parseInt(matchNumberIn, 10), teamScouted: parseInt(teamScoutedIn, 10) };
  try {
    data.data = await dbo.collection('pitdata').findOne(myobj).catch((e) => { console.error(e); data.err_occur = true; });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};
