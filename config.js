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
    },
    appApiKey: 'your_app_api_key',
    supportedLanguages: ['en', 'uk', 'zh-cn', 'pt-br', 'de', 'nl', 'fr', 'es', 'it', 'ca']
};