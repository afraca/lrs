'use strict';

const _ = require('underscore');
const constants = require('../constants');
const statementsInformer = require('./statementsInformer');
const command = require('../commands/results');

module.exports = {
    async update(statement) {
        if (!statementsInformer.isCourseStatement(statement)) {
            return;
        }

        if (statementsInformer.isStarted(statement)) {
            let result = await command.getAttempt(statement.context.registration);
            if (result) {
                return;
            }

            result = createResult(statement);
            await command.insert(result);
        } else if (statementsInformer.isCourseProgressable(statement)) {
            let result = await command.getAttempt(statement.context.registration);
            if (!result || !result.root) {
                return;
            }

            await command.pushToRoot(result._id, statement);
            await command.markRootAsModified(result._id, statement.timestamp);
        } else if (statementsInformer.isObjectiveProgressable(statement)) {
            let result = await command.getAttempt(statement.context.registration);
            if (!result || !result.embeded) {
                return;
            }

            let embeded = _.find(result.embeded, item => item.objectId === statement.object.id);
            if (!embeded) {
                embeded = createEmbededResult(statement.object.id, statement.timestamp);
                await command.pushToEmbeded(result._id, embeded);
            }

            await command.pushToEmbededRoot(result._id, embeded.objectId, statement);
            await command.markEmbededAsModified(result._id, embeded.objectId, statement.timestamp);
        } else if (statementsInformer.isAnswered(statement)) {
            let result = await command.getAttempt(statement.context.registration);
            if (!result || !result.embeded || !statement.context.contextActivities.parent
                || !statement.context.contextActivities.parent.length) {
                return;
            }

            let embeded = _.find(result.embeded,
                e => _.some(statement.context.contextActivities.parent,
                    parent => parent.id === e.objectId));

            if (!embeded) {
                let objectId = statement.context.contextActivities.parent[0].id;
                embeded = createEmbededResult(objectId, statement.timestamp);
                await command.pushToEmbeded(result._id, embeded);
            }

            await command.pushToAnswered(result._id, embeded.objectId, statement);
        } else if (statementsInformer.isExperienced(statement)) {
            let result = await command.getAttempt(statement.context.registration);
            if (!result || !result.embeded || !statement.context.contextActivities.parent
                || !statement.context.contextActivities.parent.length) {
                return;
            }

            let embeded = _.find(result.embeded,
                e => _.some(statement.context.contextActivities.parent,
                    parent => parent.id === e.objectId));

            if (!embeded) {
                let objectId = statement.context.contextActivities.parent[0].id;
                embeded = createEmbededResult(objectId, statement.timestamp);
                await command.pushToEmbeded(result._id, embeded);
            }

            await command.pushToExperienced(result._id, embeded.objectId, statement);
        }
    }
};

function createResult(startedStatement) {
    return {
        id: startedStatement.context.extensions[constants.courseKey],
        attempt_id: startedStatement.context.registration,
        first_activity: startedStatement.timestamp,
        last_activity: startedStatement.timestamp,
        root: [startedStatement],
        embeded: []
    };
}

function createEmbededResult(id, timestamp) {
    return {
        objectId: id,
        last_activity: timestamp,
        root: [],
        answered: [],
        experienced: []
    };
}