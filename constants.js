'use strict';

module.exports = {
    socketLifetime: 300000,
    dbConnectionTimeout: 60000,
    dbSocketTimeout: 300000,
    defaultLimit: 2000,
    defaultSkip: 0,
    statementsVerbs: {
        started: 'http://adlnet.gov/expapi/verbs/launched',
        passed: 'http://adlnet.gov/expapi/verbs/passed',
        failed: 'http://adlnet.gov/expapi/verbs/failed',
        mastered: 'http://adlnet.gov/expapi/verbs/mastered',
        answered: 'http://adlnet.gov/expapi/verbs/answered',
        experienced: 'http://adlnet.gov/expapi/verbs/experienced',
        progressed: 'http://adlnet.gov/expapi/verbs/progressed'
    },
    activityTypes: {
        course: 'http://adlnet.gov/expapi/activities/course',
        objective: 'http://adlnet.gov/expapi/activities/objective'
    },
    courseKey: 'http://easygenerator/expapi/course/id',
    learningPathKey: 'http://easygenerator/expapi/learningpath/id',
    entityTypes: {
        course: 'course',
        learningPath: 'learningpath'
    },
    accessTypes: {
        academy: 3
    },
    request: {
        allowedHeaders: 'X-Experience-API-Version,X-Access-Token,X-Id-Token,X-Entity-Id,X-Entity-Type,Accept,Authorization,Content-Type,If-Match,If-None-Match'
    },
    errors: {
        internalServerError: 'Something went wrong'
    }
};