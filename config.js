module.exports = {
    xApiVersion: '1.0.2',
    permissionsEndpoint: {
        hosts: [
            'localhost',
            /^\S+\.easygenerator.com$/
        ],
        coursePath: '/api/course/permissions',
        learningPathPath: '/api/learningpath/permissions'
    },
    tokensApiKey: 'your_tokens_api_key',
    tokens: {
        uri: 'tokens-staging.easygenerator.com'
    }
};