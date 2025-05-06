/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const { SNSClient, SubscribeCommand } = require('@aws-sdk/client-sns');
const sns = new SNSClient({ region: 'eu-west-1' });

exports.handler = async (event) => {
    const email = event.email;
    const topicArn = process.env.SNS_TOPIC_ARN;

    const input = {
        Protocol: 'email',
        TopicArn: topicArn,
        Endpoint: email
    };

    try {
        const command = new SubscribeCommand(input);
        const result = await sns.send(command);
        console.log('📧 Subscription initiated:', result);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Subscription request sent.' })
        };
    } catch (err) {
        console.error('❌ Subscription failed:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Subscription failed.' })
        };
    }
};
