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

const global_competition = "2020ilch"
exports.submitMatchData = async (db, scouterin, competitionin, matchin, teamin, datain) => {
    let data = {}
    data.err_occur = false
    data.err_reasons = []
    let dbo = db.db("data_scouting");
    let myobj = {"$set": {scouter: scouterin, competition: competitionin, match: matchin, team_scouted: teamin, data: datain}};
    try {
        await dbo.collection("matchdata").updateOne({_id: competitionin+matchin+teamin}, myobj, {upsert:true}).catch(e => {console.error(e);data.err_occur = true;})
    } catch (err) {
        data.err_occur = true
        data.err_reasons.push(err)
        console.error(err)
    }
    return data;
}

exports.submitShotChartData = async (db, scouterin, competitionin, matchin, teamin, datain) => {
    let data = {}
    data.err_occur = false
    data.err_reasons = []
    let dbo = db.db("data_scouting");
    let myobj = {"$set": {scouter: scouterin, competition: competitionin, match: matchin, team_scouted: teamin, data: datain}};
    try {
        await dbo.collection("shotchart").updateOne({_id: competitionin+matchin+teamin}, myobj, {upsert:true}).catch(e => {console.error(e);data.err_occur = true;})
    } catch (err) {
        data.err_occur = true
        data.err_reasons.push(err)
        console.error(err)
    }
    return data;
}

exports.fetchMatchesForCompetition = async (db, comp_idin) => {
    let data = {}
    data.err_occur = false
    data.err_reason= []
    comp_idin = String(comp_idin)
    let dbo = db.db("data_scouting");
    let myobj = {competition: String(comp_idin)};
    try {
        data.data = []
        interim = await dbo.collection("matches").find(myobj).toArray()
        data.data.competition = String(comp_idin)
        data.data.data = []
        for (let i = 0; i < interim.length; i++) {
            let scouts = interim[i].scouters
            let scout_num = 0
            for (let j = 0; j < scouts.length; j++) {
                if (typeof(scouts[j]) == "object") {
                    scout_num = scout_num + 1;
                }
            }
            data.data.data.push(scout_num)

        }
    } catch (err) {
        data.err_occur = true
        console.error(err)
    }
    return data;
}


exports.getNumberScouts = async (db, comp_idin) => {
    let data = {}
    data.err_occur = false
    data.err_reasons = []
    comp_idin = String(comp_idin)
    let dbo = db.db("data_scouting");
    let myobj = {competition: String(comp_idin)};
    let inval;
    try {
        inval  = await dbo.collection("schedule").findOne(myobj)
        data.data = inval.data.reduce((partial_sum, a) => partial_sum + a,0); 

    } catch (e) {
        data.err_occur = true
        data.err_reasons.push(e)
        console.error(e)
    }
    return data;
}


exports.fetchAllTeamNicknamesAtCompetition = async (db, comp_idin) => {
    let data = {}
    data.err_occur = false
    data.err_reason= []
    comp_idin = String(comp_idin)
    let dbo = db.db("data_scouting");
    let myobj = {competition: String(comp_idin)};
    try {
        data.data = await dbo.collection("teamlist").findOne(myobj).catch(e => {console.error(e);data.err_occur = true;})
    } catch (err) {
        data.err_occur = true
        data.err_reasons.push(err)
        console.error(err)
    }
    return data;
}

exports.findTeamNickname = async (db, team_num) => {
    let data = {}
    data.err_occur = false
    data.err_reason= []
    comp_idin = String(comp_idin)
    let dbo = db.db("data_scouting");
    let myobj = {team_num : {"$exists" : true}};
    try {
        teamlist = await dbo.collection("teamlist").findOne(myobj).catch(e => {console.error(e);data.err_occur = true;})
        data.data = teamlist[team_num]
    } catch (err) {
        data.err_occur = true
        data.err_reasons.push(err)
        console.error(err)
    }
    return data;
}

exports.fetchMatchData = async (db, comp_idin, match_numberin, team_scoutedin) => {
    let data = {}
    data.err_occur = false
    data.err_reasons = []
    let dbo = db.db("data_scouting");
    // var myobj = {_id: comp_idin + team_scoutedin + match_numberin};
    let myobj = {competition: String(comp_idin), match: parseInt(match_numberin), team_scouted: parseInt(team_scoutedin)};
    try {
        data.data = await dbo.collection("matchdata").findOne(myobj).catch(e => {console.error(e);data.err_occur = true; throw "Database error";})
    } catch (err) {
        data.err_occur = true
        data.err_reasons.push(err)
        console.error(err)
    }
    return data;
}

exports.fetchCompetitionSchedule = async (db, comp_idin) => {
  let data = {}
  data.err_occur = false
  data.err_reasons = []
  let dbo = db.db("data_scouting");
  let passin = { competition: String(comp_idin)}
  try {
    data.data = await dbo.collection("matches").find(passin).toArray()
  }  catch (err) {
      data.err_occur = true
      data.err_reasons.push(err)
      console.error(err)
  }
  return data;
}

exports.fetch2022Schedule = async (db, comp_idin) => {
    let data = {}
    data.err_occur = false
    data.err_reasons = []
    let dbo = db.db("data_scouting");
    let myobj = { teams: { $all: ["2022"] }, competition: String(comp_idin) }
    try {
        data.data = await dbo.collection("matches").find(myobj).toArray()
    } catch (err) {
        data.err_occur = true
        data.err_reasons.push(err)
        console.error(err)
    }
    return data;
}

exports.fetchShotChartData = async (db, comp_idin, match_numberin, team_scoutedin) => {
    let data = {}
    data.err_occur = false
    data.err_reasons = []
    let dbo = db.db("data_scouting");
    // var myobj = {_id: comp_idin + team_scoutedin + match_numberin};
    let myobj = {competition: String(comp_idin), match: parseInt(match_numberin), team_scouted: parseInt(team_scoutedin)};
    try {
        data.data = await dbo.collection("shotchart").findOne(myobj).catch(e => {console.error(e);data.err_occur = true;})
    } catch (err) {
        data.err_occur = true
        data.err_reasons.push(err)
        console.error(err)
    }
    return data;
}
exports.fetchScouterSuggestions = async (db, comp_idin, match_numberin) => {
    let data = {}
    data.err_occur = false
    data.err_reasons = []
    let dbo = db.db("data_scouting");
    let myobj = {competition: String(comp_idin), match: parseInt(match_numberin)};
    try {
        var out = [];
        var toProcess = await dbo.collection("matchdata").find(myobj).toArray().catch(e => {console.error(e);data.err_occur = true;})
        for (let scoutSub of toProcess) {
            if (scoutSub.data['strategy-notes']) {
                out.push({"scouter" : scoutSub.scouter.name, "strategy" : scoutSub.data['strategy-notes']})   
            }
        }
        data.data = out;

    } catch (err) {
        data.err_occur = true
        data.err_reasons.push(err)
        console.error(err)
    }
    return data;
}

exports.fetchScouterUIDs = async (db, comp_idin, match_numberin) => {
    let data = {}
    data.err_occur = false
    data.err_reason= []
    comp_idin = String(comp_idin)
    let dbo = db.db("data_scouting");
    let myobj = {competition: String(comp_idin), match: parseInt(match_numberin)};
    try {
        matchdata = await dbo.collection("matches").findOne(myobj).catch(e => {console.error(e);data.err_occur = true;});
        data.scouters = matchdata.scouters
        data.teams = matchdata.teams
    } catch (err) {
        data.err_occur = true
        data.err_reasons.push(err)
        console.error(err)
    }
    return data;
}

exports.addScouterToMatch = async (db, userin, namein, matchin, team_scouted) => {
    let data = {}
    data.err_occur = false
    data.err_reasons = []
    let dbo = db.db("data_scouting");
    let myobj = {match: parseInt(matchin)}
    try {
        const interim = await dbo.collection("matches").findOne(myobj).catch(e => {console.error(e);data.err_occur = true;})
        const index = interim.teams.indexOf(String(team_scouted));
        if (index < 0) {
            console.error("Does not exist")
            data.err_occur = true
            data.err_reasons.push("Team does not exist in scout schedule")
        }
        interim.scouters[index] = {name: String(namein), id: String(userin)} ;
        await dbo.collection("matches").findOneAndReplace(myobj, interim, {upsert: true}).catch(e => {console.error(e);data.err_occur = true;})
        let myobj2 = {competition: global_competition}
        const matchsched = await dbo.collection("schedule").findOne(myobj2).catch(e => {console.error(e);data.err_occur = true;})
        matchsched.data[matchin - 1] += 1
        await dbo.collection("schedule").findOneAndReplace(myobj2, matchsched, {upsert: true}).catch(e => {console.error(e);data.err_occur = true;})
    } catch (err) {
        data.err_occur = true
        data.err_reasons.push(err)
        console.error(err)
    }
    return data
}

exports.removeScouterFromMatch = async (db, userin, matchin, team_scouted) => {
    let data = {}
    data.err_occur = false
    data.err_reasons = []
    let dbo = db.db("data_scouting");
    let myobj = {match: parseInt(matchin)}
    try {
        const interim = await dbo.collection("matches").findOne(myobj).catch(e => {console.error(e);data.err_occur = true;})
        const index = interim.teams.indexOf(String(team_scouted));
        if (index < 0) {
            console.error("Does not exist")
            data.err_occur = true
            data.err_reasons.push("Team does not exist in scout schedule")
        }
        interim.scouters[index] = false;
        await dbo.collection("matches").findOneAndReplace(myobj, interim, {upsert: true}).catch(e => {console.error(e);data.err_occur = true;})
        let myobj2 = {competition: global_competition} // TODO: Fix Hardcoding of this
        const matchsched = await dbo.collection("schedule").findOne(myobj2).catch(e => {console.error(e);data.err_occur = true;})
        matchsched.data[matchin - 1] -= 1
        await dbo.collection("schedule").findOneAndReplace(myobj2, matchsched, {upsert: true}).catch(e => {console.error(e);data.err_occur = true;})
    } catch (err) {
        data.err_occur = true
        data.err_reasons.push(err)
        console.error(err)
    }
    return data
}

exports.getDataOnTeam = async (db, teamin, compin) => {
    let data = {}
    data.err_occur = false
    data.err_reasons = []
    let dbo = db.db("data_scouting");
    let myobj = { team_scouted : parseInt(teamin), competition: String(compin) }
    try {
        data.data = await dbo.collection("matchdata").find(myobj).toArray()
    } catch (err) {
        data.err_occur = true
        data.err_reasons.push(err)
        console.error(err)
    }
    return data
}

exports.submitStrategy = async (db, scouterin, matchin, compin, datain) => {
    let data = {}
    data.err_occur = false
    data.err_reasons = []
    let dbo = db.db("strategies");
    let myobj = {"$set": {scouter: scouterin, competition: compin, match: matchin, data: datain}};
    try {
        await dbo.collection("data").updateOne({_id: compin+scouterin+matchin}, myobj, {upsert:true})
    } catch (err) {
        data.err_occur = true
        data.err_reasons.push(err)
        console.error(err)
    }
    return data;
}

exports.fetchStrategy = async (db, comp_idin, match_idin) => {
    let data = {}
    data.err_occur = false
    data.err_reasons = []
    let dbo = db.db("strategies");
    let myobj = {competition: String(comp_idin), match: String(match_idin)}
    console.log(myobj)
    try {
        data.data = await dbo.collection("data").find(myobj).toArray()
        console.log(data.data)
    } catch (err) {
        data.err_occur = true
        data.err_reasons.push(err)
        console.error(err)
    }
    return data;
}

exports.getUserStrategy = async (db, comp_idin, match_idin, namein) => {
    let data = {}
    data.err_occur = false
    data.err_reasons = []
    let dbo = db.db("strategies");
    let myobj = {competition: String(comp_idin), match: String(match_idin), scouter: String(namein)}
    console.log(myobj)
    try {
        data.data = await dbo.collection("data").find(myobj).toArray()
        console.log(data.data)
    } catch (err) {
        data.err_occur = true
        data.err_reasons.push(err)
        console.error(err)
    }
    return data;
}

exports.submitPitData = async (db, scouterin, competitionin, matchin, teamin, datain) => {
    let data = {}
    data.err_occur = false
    data.err_reasons = []
    let dbo = db.db("data_scouting");
    let myobj = {"$set": {scouter: scouterin, competition: competitionin, match: matchin, team_scouted: teamin, data: datain}};
    try {
        await dbo.collection("pitdata").updateOne({_id: competitionin+matchin+teamin}, myobj, {upsert:true}).catch(e => {console.error(e);data.err_occur = true;})
    } catch (err) {
        data.err_occur = true
        data.err_reasons.push(err)
        console.error(err)
    }
    return data;
}

exports.fetchPitData = async (db, comp_idin, match_numberin, team_scoutedin) => {
    let data = {}
    data.err_occur = false
    data.err_reasons = []
    let dbo = db.db("data_scouting");
    // var myobj = {_id: comp_idin + team_scoutedin + match_numberin};
    let myobj = {competition: String(comp_idin), match: parseInt(match_numberin), team_scouted: parseInt(team_scoutedin)};
    try {
        data.data = await dbo.collection("pitdata").findOne(myobj).catch(e => {console.error(e);data.err_occur = true;})
    } catch (err) {
        data.err_occur = true
        data.err_reasons.push(err)
        console.error(err)
    }
    return data;
}
