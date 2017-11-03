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
    tokensApiKey: '76ca5c067d614b419656e83b9f443864',
    tokens: {
        uri: 'tokens-staging.easygenerator.com'
    },
    appApiKey: 'your_app_api_key'
};