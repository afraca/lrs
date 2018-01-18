'use strict';

const queryParser = require('../../queryParser');
const queryExtender = require('../../helpers/queryExtender');
const constants = require('../../constants');
const command = require('../../commands/results');

const courseKey = `context.extensions.${constants.courseKey}`;
const learningPathKey = `context.extensions.${constants.learningPathKey}`;

module.exports = {
    get: async ctx => {
        var query = ctx.request.query || {};
        queryExtender.addEntityInfoToQuery(query, ctx.entityId, ctx.entityType);

        let loadEmbededStatements = query.embeded;
        let csv = query.csv;
        let options = queryParser.generateOptions(query,
            constants.defaultLimit,
            constants.defaultSkip
        );
        let contentType = 'application/json';
        let stream;

        if (query.csv) {
            let isCourseResult = ctx.entityType === constants.entityTypes.course;
            let idKey = isCourseResult ? courseKey : learningPathKey;
            stream = await command.getCsv(options.objectId[idKey], isCourseResult,
                options.specifiedSkip, options.specifiedLimit, options.since,
                options.until, csv, options.cultures);
            contentType = 'text/csv';
        } else if (loadEmbededStatements) {
            stream = await command.getFull(options.objectId[courseKey], options.specifiedSkip,
                options.specifiedLimit, options.since, options.until);
        } else {
            stream = await command.getRoot(options.objectId[courseKey],
                options.specifiedSkip, options.specifiedLimit, options.since, options.until);
        }

        if (stream) {
            ctx.status = 200;
            ctx.type = contentType;
            ctx.body = stream;
        }
    },
    archive: async ctx => {
        await markAttempt(ctx, command.markAsArchived);
    },
    unarchive: async ctx => {
        await markAttempt(ctx, command.unmarkAsArchived);
    }
};

async function markAttempt(ctx, handler) {
    let attemptId = ctx.params.attemptId;
    let attempt = await command.getIdByAttemptId(attemptId);
    if (!attempt) {
        ctx.status = 404;
        ctx.body = { message: 'Attempt with such id has not been found' };
        return;
    }

    if (attempt.id !== ctx.entityId) {
        ctx.status = 403;
        ctx.body = { message: 'You dont have permissions for this operation' };
        return;
    }

    handler(attemptId);
    ctx.status = 200;
    ctx.body = { message: 'OK' };
}