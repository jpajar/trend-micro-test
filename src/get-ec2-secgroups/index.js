import AWS from 'aws-sdk'

/**
 * Returns list of security groups within EC2.
 * @function
 * @returns {object} returns response object containing list of EC2 security groups
 */
export const handler = async () => {
  try {
    const ec2 = new AWS.EC2()
    const params = { MaxResults: 1000 }
    const result = await ec2.describeSecurityGroups(params).promise()
    const response = {
      statusCode: 200,
      body: JSON.stringify(result)
    }
    return response
  } catch (e) {
    const response = {
      statusCode: '400',
      error: e
    }
    return response
  }
}
