'use strict';

const queryParser = require('../../queryParser');
const queryExtender = require('../../helpers/queryExtender');
const constants = require('../../constants');
const command = require('../../commands/results');

const courseKey = `context.extensions.${constants.courseKey}`;

module.exports = {
    get: async (req, res) => {
        var query = req.query || {};
        queryExtender.addEntityInfoToQuery(query, req.entityId, req.entityType);

        let loadEmbededStatements = query.embeded;
        let options = queryParser.generateOptions(query,
            constants.defaultLimit,
            constants.defaultSkip
        );

        let stream;
        if (loadEmbededStatements) {
            stream = await command.getFull(options.objectId[courseKey],
                options.specifiedSkip, options.specifiedLimit);
        } else {
            stream = await command.getRoot(options.objectId[courseKey],
                options.specifiedSkip, options.specifiedLimit);
        }

        if (stream) {
            res.body = stream;
            res.status(200);
        }
    },
    archive: async (req, res) => {
        await markAttempt(req, res, command.markAsArchived);
    },
    unarchive: async (req, res) => {
        await markAttempt(req, res, command.unmarkAsArchived);
    }
};

async function markAttempt(req, res, handler) {
    let attemptId = req.params.attemptId;
    let attempt = await command.getIdByAttemptId(attemptId);
    if (!attempt) {
        res.status(404).json({ message: 'Attempt with such id has not been found' });
        return;
    }

    if (attempt.id !== req.entityId) {
        res.status(403).json({ message: 'You dont have permissions for this operation' });
        return;
    }

    handler(attemptId);
    res.status(200).json({ message: 'OK' });
}