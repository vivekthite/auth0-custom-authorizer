'use strict';

const auth0Authorizer = require('./authorizer');

module.exports.handler = async event => {
  console.log('event',event);
  const authHeader = event.authorizationToken;
  const auth0BaseUrl = process.env.AUTH0_BASE_URL;
  const methodArn = event.methodArn;
  await auth0Authorizer(authHeader,auth0BaseUrl,'RS256');
  return {
    principalId: 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement:[
        {
          Effect: 'Allow',
          Action: 'execute-api:Invoke',
          Resource: methodArn
        }
      ]

    }
  }
};
