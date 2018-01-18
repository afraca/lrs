'use strict';

module.exports = {
    emailRegex: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    extensions: {
        survey: 'http://easygenerator/expapi/question/survey',
        questionType: 'http://easygenerator/expapi/question/type'
    },
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
    questionTypes: {
        informationContent: 'informationContent',
        singleSelectText: 'singleSelectText',
        singleSelectImage: 'singleSelectImage',
        multipleSelect: 'multipleSelect',
        dragAndDropText: 'dragAndDropText',
        statement: 'statement',
        textMatching: 'textMatching',
        rankingText: 'rankingText',
        fillInTheBlank: 'fillInTheBlank',
        openQuestion: 'openQuestion',
        hotspot: 'hotspot',
        scenario: 'scenario'
    },
    csv: {
        defaultValue: '-',
        sectionMark: 'S:',
        questionMark: 'Q:'
    }
};