import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { handler } from './index'
describe('get-ec2-secgroups', () => {

    it('should return 202 and security groups in ec2', async () => {
        // Overwriting DynamoDB.getItem()
        AWSMock.setSDKInstance(AWS);
        console.log(handler);
        AWSMock.mock('EC2', 'describeSecurityGroups', (params, callback) => {
            console.log('EC2', 'describeSecurityGroups', 'mock called');
            callback(null, { "Description": "testing security groups", "GroupName": "test-security-group", "GroupId": "test-id" });
        })
        expect(await handler('test')).toStrictEqual({ "body": JSON.stringify({ "Description": "testing security groups", "GroupName": "test-security-group", "GroupId": "test-id" }), "statusCode": 202 });

        AWSMock.restore('EC2');
    });

    it('should return 401 error', async () => {
        // Overwriting DynamoDB.getItem()
        AWSMock.setSDKInstance(AWS);
        console.log(handler);
        AWSMock.mock('EC2', 'describeSecurityGroups', (params, callback) => {
            console.log('EC2', 'describeSecurityGroups', 'mock called');
            callback('Test Error', null);
        })
        expect(await handler('test')).toStrictEqual({ "error": "Test Error", "statusCode": "400" });

        AWSMock.restore('EC2');
    });
});