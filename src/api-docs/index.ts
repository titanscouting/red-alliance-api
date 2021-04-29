import generateRouteJSONs from './routeDocs';

export default {
  swagger: '2.0',
  info: {
    version: '0.12.0',
    title: 'The Red Alliance API',
    description: 'An API to submit and retrieve data for and from The Red Alliance family of products.',
    license: {
      name: 'Licensed under the BSD 3-Clause license',
      url: 'https://raw.githubusercontent.com/titanscouting/red-alliance-api/master/LICENSE',
    },
  },
  definitions: {
    NoAuth: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
        },
        reason: {
          type: 'string',
          example: 'User could not be authenticated',
        },
      },
    },
    KeysNotAllowed: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
        },
        reason: {
          type: 'string',
          example: 'This route does not allow authentication via API key',
        },
      },
    },
    NoData: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
        },
        reasons: {
          type: 'array',
          example: [
            'Could not connect to the DB',
          ],
        },
      },
    },
  },
  components: {
    securitySchemes: {
      GoogleAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'token',
        description: 'Use the Backend Authenticaation JWT provided to you by the frontend Google OAuth flow.',
      },
      CLIENT_ID: {
        type: 'apiKey',
        in: 'header',
        name: 'CLIENT_ID',
        description: 'Use the Client ID issued to you. MUST BE USED IN CONJUNCTION WITH CLIENT_SECRET.',
      },
      CLIENT_SECRET: {
        type: 'apiKey',
        in: 'query',
        name: 'CLIENT_SECRET',
        description: 'Use the Client secret issued to you. MUST BE USED IN CONJUNCTION WITH CLIENT_ID.',
      },
    },
  },
  servers: [
    {
      url: 'https://titanscouting.epochml.org',
      description: 'Production environment',
    },
  ],
  tags: [
    {
      name: 'Authenticated Routes',
      description: 'Routes which require authentication to interact with',
    },
    {
      name: 'Non-Authenticated Routes',
      description: 'Routes which do not require authentication to interact with',
    },
  ],
  consumes: [
    'application/json',
  ],
  produces: [
    'application/json',
  ],
  paths: generateRouteJSONs(),
}
