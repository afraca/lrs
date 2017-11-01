'use strict';

const queryParser = require('../../queryParser');
const queryExtender = require('../../helpers/queryExtender');
const db = require('../../db');
const constants = require('../../constants');
const resultsUpdater = require('../../helpers/resultsUpdater');

module.exports = {
    post: async ctx => {
        var statement = ctx.request.body;
        await db.statements.insert(statement);
        if (statement.length) {
            for (let i = 0; i < statement.length; i++) {
                await resultsUpdater.update(statement[i]);
            }
        } else {
            await resultsUpdater.update(statement);
        }
        ctx.status = 200;
    },
    get: async ctx => {
        var query = ctx.request.query || {};
        queryExtender.addEntityInfoToQuery(query, ctx.entityId, ctx.entityType);

        let options = queryParser.generateOptions(
            query,
            constants.defaultLimit,
            constants.defaultSkip
        );

        let statements = await db.statements.find(options.criteria, {
            limit: options.specifiedLimit,
            skip: options.specifiedSkip,
            sort: { timestamp: -1 },
            fields: { _id: 0 }
        });

        if (statements) {
            ctx.status = 200;
            ctx.body = { statements };
        }
    }
};