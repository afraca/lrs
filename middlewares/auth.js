'use strict';

const config = require('../config');
const httpRequestSender = require('../utils/httpRequestSender');
const idTokenAuth = require('./idTokenAuth');

module.exports = async (ctx, next) => {
    const accessToken = ctx.get('X-Access-Token');
    if (accessToken) {
        let info = await httpRequestSender.get(`https://${config.tokensUri}/${accessToken}`, {
            'X-Api-Key': config.tokensApiKey
        });

        if (!info || info.revoked || !info.entityId || !info.entityType || info.scopes.indexOf('read') === -1 || !info.createdBy) {
            return reject(ctx);
        }

        ctx.entityId = info.entityId;
        ctx.entityType = info.entityType;
        ctx.identityId = info.createdBy;
        await next();
        return;
    }

    await idTokenAuth(ctx, next);
};

function reject(request) {
    request.body = 'Access denied';
    request.status = 403;
}