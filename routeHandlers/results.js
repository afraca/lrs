'use strict';

const queryParser = require('../queryParser');
const queryExtender = require('../helpers/queryExtender');
const constants = require('../constants');
const command = require('../commands/results');

const courseKey = 'context.extensions.' + constants.courseKey;

module.exports = async ctx => {
    var query = ctx.request.query || {};
    queryExtender.addEntityInfoToQuery(query, ctx.entityId, ctx.entityType);
    
    var loadEmbededStatements = query.embeded;
    var options = queryParser.generateOptions(query, constants.defaultLimit, constants.defaultSkip);

    var stream;
    if (loadEmbededStatements) {
        stream = await command.getFull(options.objectId[courseKey], options.specifiedSkip, options.specifiedLimit);
    } else {
        stream = await command.getRoot(options.objectId[courseKey], options.specifiedSkip, options.specifiedLimit);
    }

    if (stream) {
        ctx.status = 200;
        ctx.type = 'application/json';
        ctx.body = stream;
    }
};