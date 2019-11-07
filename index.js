import AWS from "aws-sdk";
AWS.config.update({endpoint: "https://dynamodb.us-east-2.amazonaws.com"});
let dynamodb = new AWS.DynamoDB();
let dbClient = new AWS.DynamoDB.DocumentClient();
console.log("Querying...")
