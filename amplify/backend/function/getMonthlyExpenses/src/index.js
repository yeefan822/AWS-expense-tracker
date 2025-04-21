const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'Expense-vv5crm6kdnhvvi6fhpjnzync3y-dev';

exports.handler = async (event) => {
    const userId = event.identity?.sub;
    const currentMonth = new Date().toISOString().substring(0, 7);

    const params = {
        TableName: TABLE_NAME,
        FilterExpression: 'userId = :uid AND begins_with(#date, :month)',
        ExpressionAttributeValues: {
            ':uid': userId,
            ':month': currentMonth
        },
        ExpressionAttributeNames: {
            '#date': 'date'
        }
    };

    try {
        const data = await docClient.scan(params).promise();
        const total = data.Items.reduce((sum, item) => sum + (item.amount || 0), 0);
        console.log('Returning total:', total);


        return {
            total
        };
    } catch (err) {
        console.error('error:', err);
        throw new Error(err.message); // AppSync 会自动返回 error
    }
};


