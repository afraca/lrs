'use strict';

module.exports = async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    ctx.set('Access-Control-Allow-Headers', 'X-Experience-API-Version,X-Access-Token,X-Id-Token,X-Entity-Id,X-Entity-Type,Accept,Authorization,Content-Type,If-Match,If-None-Match');

    if (ctx.method === 'OPTIONS') {
        ctx.status = 200;
    } else {
        await next();
    }
};