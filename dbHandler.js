let AWS = require("aws-sdk")
AWS.config.update({region: "us-east-2", endpoint: "https://dynamodb.us-east-2.amazonaws.com"});
let dbClient = new AWS.DynamoDB.DocumentClient();  

let errorcode = 0

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
exports.addUser = (id, name) => {
    const datum = {
        TableName: "userlist",
        Item: {
            id: id, 
            name: name,
        }
    }
    dbClient.put(datum, (err) => {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            errorcode = 1
        }
    });
    return errorcode
};


exports.addUserToTeam = (id, team, position) => {
    db_id = this.checkDB("userlist", id)
    db_id.then((result) => {
        console.log(db_id)
        console.log(result)
    })
    // if (db_id !== id) {
    //     throw new Error("User ID does not exist")
    // }
    const datum = {
        TableName: "UserAssociations",
        Item: {
            id: id, 
            team: team,
            position: position
        }
    }
    dbClient.put(datum, function(err) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            errorcode = 1
        }
    });
    return errorcode
};
