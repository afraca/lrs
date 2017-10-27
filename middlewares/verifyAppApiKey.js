'use strict';

const config = require('../config');

module.exports = async (ctx, next) => {
    const apiKey = ctx.get('X-API-Key');

    if (apiKey === config.appApiKey) {
        await next();
    } else {
        ctx.body = 'Access denied. Invalid \'X-API-Key\' header was supplied';
        ctx.status = 403;
    }
};