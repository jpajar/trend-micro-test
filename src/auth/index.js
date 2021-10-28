import _ from 'lodash';

import AWS from "aws-sdk";

export const handler = async (event) => {
    // Exit if warmup plugin payload is detected
    if (event.source === 'serverless-plugin-warmup') {
        console.info('Keeping lambda warm');
        return 'Lambda is warm';
    }

    const apiKey = event.headers['x-api-key'];
    const apiGateway = new AWS.APIGateway();

    const keys = await apiGateway
        .getApiKeys({ includeValues: true, limit: 500 })
        .promise();

    let sender = _.find(keys.items, ['value', apiKey]);
    if (_.isNil(sender))
        throw new Error("Unauthorized");

    console.info(`event from : ${sender.name}`);
    return {
        principalId: sender.name,
        usageIdentifierKey: apiKey,
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Action: "execute-api:Invoke",
                    Resource: `${event.methodArn}`
                }
            ]
        },
    };
};
