import _ from 'lodash'

import AWS from 'aws-sdk'
/**
 * Returns IAM policy to access requested ARN
 * @function
 * @param {object} event payload containing x-api-key
 * @returns {object} relevant IAM policy
 */
export const handler = async (event) => {
  // Exit if warmup plugin payload is detected
  if (event.source === 'serverless-plugin-warmup') {
    console.info('Keeping lambda warm')
    return 'Lambda is warm'
  }

  const apiKey = event.headers['x-api-key']
  const apiGateway = new AWS.APIGateway()

  const keys = await apiGateway
    .getApiKeys({ includeValues: true, limit: 500 })
    .promise()

  const key = _.find(keys.items, ['value', apiKey])
  if (_.isNil(key)) { throw new Error('Unauthorized') }

  console.info(`event from : ${key.name}`)
  return {
    principalId: key.name,
    usageIdentifierKey: apiKey,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: 'execute-api:Invoke',
          Resource: `${event.methodArn}`
        }
      ]
    }
  }
}
