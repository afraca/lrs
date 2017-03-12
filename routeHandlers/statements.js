'use strict';

const queryParser = require('../queryParser');
const queryExtender = require('../helpers/queryExtender');
const db = require('../db');
const constants = require('../constants');

module.exports = async ctx => {
    var query = ctx.request.query || {};
    queryExtender.addEntityInfoToQuery(query, ctx.entityId, ctx.entityType);
    
    var options = queryParser.generateOptions(query, constants.defaultLimit, constants.defaultSkip);

    var statements = await db.statements.find(options.criteria, { limit: options.specifiedLimit, skip: options.specifiedSkip, sort: { timestamp: -1 }, fields: { _id: 0 } });
    
    if (statements) {
        ctx.status = 200;
        ctx.body = { statements: statements };
    }
};