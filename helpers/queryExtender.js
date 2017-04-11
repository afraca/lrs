'use strict';

const constants = require('../constants');

const courseKey = `context.extensions.${constants.courseKey}`;
const learningPathKey = `context.extensions.${constants.learningPathKey}`;

module.exports = {
    addEntityInfoToQuery(query, entityId, entityType) {
        if (entityType === constants.entityTypes.learningPath) {
            query[learningPathKey] = entityId;
        } else {
            query[courseKey] = entityId;
        }
    }
};