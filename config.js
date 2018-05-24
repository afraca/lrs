module.exports = {
    xApiVersion: '1.0.2',

    log: {
        level: process.env.LOG_LEVEL || 'warn'
    },

    app: {
        port: process.env.PORT || 3000,
        ip: process.env.IP
    },

    db: {
        url: `mongodb://${process.env.DBHOST || process.env.IP || '127.0.0.1'}`,
        name: process.env.DBNAME || 'lrs',
        options: {
            connectTimeoutMS: process.env.DBCONNECTIONTIMEOUT || 60000,
            socketTimeoutMS: process.env.DBSOCKETTIMEOUT || 300000
        }
    },

    permissionsEndpoint: {
        hosts: (process.env.PERMISSIONS_ENDPOINT_HOSTS &&
            process.env.PERMISSIONS_ENDPOINT_HOSTS.split(',')) || [
                'localhost',
                /^\S+\.easygenerator.com$/
            ],
        coursePath: '/api/course/permissions',
        learningPathPath: '/api/learningpath/permissions'
    },
    tokensUri: process.env.TOKENS_URI || 'tokens-staging.easygenerator.com',
    tokensApiKey: process.env.TOKENS_API_KEY,
    appApiKey: process.env.APP_API_KEY,
    supportedLanguages: ['en', 'uk', 'zh-cn', 'pt-br', 'de', 'nl', 'fr', 'es', 'it', 'ca']
};
