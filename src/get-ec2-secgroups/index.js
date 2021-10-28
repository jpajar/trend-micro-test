import AWS from "aws-sdk";


export const handler = async (event) => {
    try {
        const ec2 = new AWS.EC2({apiVersion: '2016-11-15', region: 'ap-southeast-2'});
        const params = { MaxResults: 1000};
        const result = await ec2.describeSecurityGroups(params).promise();
        const response = {
            statusCode: 202,
            body: JSON.stringify(result)
        };
        return response;
    }
    catch(e) {
        console.error(e);
    }
};
