'use strict';

const config = require('../config');

module.exports = async (ctx, next) => {
    const header = 'X-Experience-API-Version';
    if (ctx.get(header) && ctx.get(header).substring(0, 3) === config.xApiVersion.substring(0, 3)) {
        await next();
    } else {
        ctx.body = 'Invalid \'X-Experience-API-Version\' header was supplied';
        ctx.status = 400;
    }
    ctx.set(header, config.xApiVersion);
};