'use strict';

const _ = require('underscore');
const constants = require('../constants');
const statementsInformer = require('./statementsInformer');
const command = require('../commands/results');

module.exports = {
    async update(statement) {
        if (!statementsInformer.isCourseStatement(statement)) { return; }
        var result = null;
        var embeded = null;
        if (statementsInformer.isStarted(statement)) {
            result = await command.getAttempt(statement.context.registration);
            if (result) { return; }
            result = createResult(statement);
            await command.insert(result);
        } else if (statementsInformer.isCourseProgressable(statement)) {
            result = await command.getAttempt(statement.context.registration);
            if (!result || !result.root) { return; }
            await command.pushToRoot(result._id, statement);
            await command.markRootAsModified(result._id, statement.timestamp);
        } else if (statementsInformer.isObjectiveProgressable(statement)) {
            result = await command.getAttempt(statement.context.registration);
            if (!result) { return; }
            embeded = result.embeded ? _.find(result.embeded, item => item.objectId === statement.object.id) : null;
            if (!embeded) {
                embeded = createEmbededResult(statement);
                var child = await command.getChildStatements(statement.context.registration, statement.object.id);
                applyChildStatements(embeded, child);
                await command.pushToEmbeded(result._id, embeded);
            } else {
                await command.pushToEmbededRoot(result._id, embeded.objectId, statement);
            }
            await command.markEmbededAsModified(result._id, embeded.objectId, statement.timestamp);
        } else if (statementsInformer.isAnswered(statement) || statementsInformer.isExperienced(statement)) {
            result = await command.getAttempt(statement.context.registration);
            if (!result || !result.embeded) { return; }
            embeded = _.find(result.embeded, e => _.some(statement.context.contextActivities.parent, parent => parent.id === e.objectId));
            if (!embeded) { return; }
            if (statementsInformer.isAnswered(statement)) {
                await command.pushToAnswered(result._id, embeded.objectId, statement);
            } else {
                await command.pushToExperienced(result._id, embeded.objectId, statement);
            }
        }
    }
};

function applyChildStatements(source, child) {
    if (!child || !child.length) { return; }
    for (var i = 0; i < child.length; i++) {
        if (statementsInformer.isAnswered(child[i])) {
            source.answered.push(child[i]);
        } else if (statementsInformer.isExperienced(child[i])) {
            source.experienced.push(child[i]);
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
};

function createEmbededResult(objectiveStatement) {
    return {
        objectId: objectiveStatement.object.id,
        last_activity: objectiveStatement.timestamp,
        root: [objectiveStatement],
        answered: [],
        experienced: []
    };
};