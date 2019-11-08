let AWS = require("aws-sdk")
AWS.config.update({region: "us-east-2", endpoint: "https://dynamodb.us-east-2.amazonaws.com"});
let dynamodb = new AWS.DynamoDB();
let dbClient = new AWS.DynamoDB.DocumentClient();  


exports.addName = (name, data) => {
    let datum = {
        TableName: "robotics_testing",
        Item: {
            name: name, 
            data: data 
        }
    }
    dbClient.put(datum, function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });
    console.log(name, data)
};