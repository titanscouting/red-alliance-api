
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

exports.submitMatchData = async (db, idin, competitionin, matchin, teamin, datain) => {
    let data = {}
    data.err_occur = false
    data.err_reasons = []
    idin = String(idin)
    let dbo = db.db("data_scouting");
    let myobj = {"$set": {id: idin, competition: competitionin, match: matchin, team_scouted: teamin, data: datain}};
    try {
        await dbo.collection("matchdata").updateOne({_id: competitionin+matchin+teamin}, myobj, {upsert:true}).catch(e => {console.error(e);data.err_occur = true;})
    } catch (err) {
        data.err_occur = true
        data.err_reasons.push(err)
        console.error(err)
    }
    return data;
}

exports.submitShotChartData = async (db, idin, competitionin, matchin, teamin, datain) => {
    let data = {}
    data.err_occur = false
    data.err_reasons = []
    idin = String(idin)
    let dbo = db.db("data_scouting");
    let myobj = {"$set": {id: idin, competition: competitionin, match: matchin, team_scouted: teamin, data: datain}};
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
    console.log(myobj)
    try {
        data.data = await dbo.collection("schedule").findOne(myobj).catch(e => {console.error(e);data.err_occur = true;})
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
        data.data = await dbo.collection("matchdata").findOne(myobj).catch(e => {console.error(e);data.err_occur = true;})
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

exports.addScouterToMatch = async (db, userin, matchin, team_scouted) => {
    let data = {}
    data.err_occur = false
    data.err_reasons = []
    let dbo = db.db("data_scouting");
    let myobj = {match: matchin}
    try {
        let interim = await dbo.collection("matches").findOne(myobj).catch(e => {console.error(e);data.err_occur = true;})
        let index = interim.data.teams.indexOf(team_scouted);
        interim.data.scouters[index] = userin;
        await dbo.collection("matches").findOneAndReplace(myobj, interim.data, {upsert: true}).catch(e => {console.error(e);data.err_occur = true;})
    } catch (err) {
        data.err_occur = true
        data.err_reasons.push(err)
        console.error(err)
    }
    return data
}