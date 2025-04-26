const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();



exports.handler = async (event) => {
    const userId = event.identity?.sub;
    const currentMonth = new Date().toISOString().substring(0, 7);

    const params = {
        TableName: process.env.TABLE_NAME,
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

        if (total > 2000) {
            const message = `⚠️ User ${userId} has spent $${total} this month.`;
            const params = {
                TopicArn: process.env.SNS_TOPIC_ARN,
                Message: message,
                Subject: 'Spending Alert'
            };

            await sns.publish(params).promise();
            console.log('Alert sent via SNS:', message);
        }


        return {
            total
        };
    } catch (err) {
        console.error('error:', err);
        throw new Error(err.message); // AppSync 会自动返回 error
    }
};


