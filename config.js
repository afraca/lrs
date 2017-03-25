module.exports = {
    version: '1.0.2',
    permissionsEndpoint: {
        hosts: [
            'localhost',
            /^\S+\.easygenerator.com$/
        ],
        coursePath: '/api/course/permissions',
        learningPathPath: '/api/learningpath/permissions'
    },
    apiKey: 'yourApiKey'
};