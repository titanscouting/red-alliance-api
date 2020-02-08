let MongoClient = require('mongodb').MongoClient;

let errorcode = 0

const url = "mongodb+srv://api_user:epycepoch2019@2022-scouting-4vfuu.mongodb.net/test?retryWrites=true&w=majority";

exports.checkDB = async (table, val) => {
    var params = { }
    params.TableName = table;
    var key = { "id": val};
    params.Key = key;
    
    return dbClient.get(params, function(err, data) {
        if (err)
            console.log(err);
    });
}
exports.addUserToTeam = (idin, namein, positionin) => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("data_scouting");
        var myobj = { id: idin, name: namein, position: positionin};
        dbo.collection("userlist").updateOne(myobj, {upsert:true}, function(err, res) {
          if (err) {
              console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
              errorcode = 1
          }
          console.log("1 document inserted");
          db.close();
        });
      });
};


exports.getCompetitions = (idin) => {
    let rval;
    // Get the competitions for a team member. Currently, one user can only be part of one team. 
    try {
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
            var dbo = db.db("data_scouting");
            var myobj = { id: idin};
            dbo.collection("userlist").findOne(myobj, function(err, res) {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                    errorcode = 1
                }
                console.log("Found");
                rval = result
                db.close();
            });
        });
    } catch(err) {
        console.error(err)
    }
    return rval
}

exports.submitMatchData = (idin, competitionin, matchin, teamin, datain) => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("data_scouting");
        var myobj = { id: idin, competition: competitionin, match: matchin, team_scouted: teamin, data: JSON.parse(datain)};
        dbo.collection("matchdata").updateOne(myobj, {upsert:true}, function(err, res) {
          if (err) {
              console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
              errorcode = 1
          }
          console.log("1 document inserted");
          db.close();
        });
      });
};
