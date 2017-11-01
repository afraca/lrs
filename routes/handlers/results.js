'use strict';

const queryParser = require('../../queryParser');
const queryExtender = require('../../helpers/queryExtender');
const constants = require('../../constants');
const command = require('../../commands/results');

const courseKey = `context.extensions.${constants.courseKey}`;

module.exports = {
    get: async ctx => {
        var query = ctx.request.query || {};
        queryExtender.addEntityInfoToQuery(query, ctx.entityId, ctx.entityType);

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
            ctx.status = 200;
            ctx.type = 'application/json';
            ctx.body = stream;
        }
    },
    archive: async (ctx, attemptId) => {
        await this._markAttempt(ctx, attemptId, () => command.markAsArchived(attemptId));
    },
    unarchive: async (ctx, attemptId) => {
        await this._markAttempt(ctx, attemptId, () => command.unmarkAsArchived(attemptId));
    },
    async _markAttempt(ctx, attemptId, handler) {
        let attempt = await command.getIdByAttemptId(attemptId);
        if (!attempt) {
            ctx.status = 404;
            ctx.body = { message: 'Attempt with such is has not been found' };
        }

        if (attempt.id !== ctx.entityId) {
            ctx.status = 403;
            ctx.body = { message: 'You dont have permissions for this operation' };
        }

        handler();
        ctx.status = 200;
        ctx.body = { message: 'OK' };
    }
};