'use strict';

const decodeJWT = require('jwt-decode');
const config = require('../config');
const constants = require('../constants');
const db = require('../db');
const httpRequestSender = require('../utils/httpRequestSender');

module.exports = async (ctx, next) => {
    if (ctx.originalUrl.indexOf('accessTokens') === -1) {
        const accessToken = ctx.get('X-Access-Token');
        if (accessToken) {
            let info = await db.tokens.findOne({ id: accessToken });
            if (!info || info.revoked || !info.entityId || !info.entityType || info.scopes.indexOf('read') === -1 || !info.createdBy) {
                return reject(ctx);
            }
            ctx.entityId = info.entityId;
            ctx.entityType = info.entityType;
            ctx.identityId = info.createdBy;
            await next();
            return;
        }
    }
    const idToken = ctx.get('X-Id-Token');
    const entityId = ctx.get('X-Entity-Id');
    const entityType = ctx.get('X-Entity-Type');
    if (!idToken || !entityId || !entityType) {
        return reject(ctx);
    }
    try {
        let token = decodeJWT(idToken);
        let protocol = 'https';
        let issuer = token.iss;
        let identityId = token.unique_name;
        // TODO: fix bug with local issuer
        if (issuer === 'localhost') {
            protocol = 'http';
            issuer = 'localhost:666';
        }
        let hostIndex = config.permissionsEndpoint.hosts.indexOf(issuer);
        if (!issuer || hostIndex === -1) {
            return reject(ctx);
        }
        let path = config.permissionsEndpoint.coursePath;
        let data = { courseId: entityId };
        if (entityType === constants.entityTypes.learningPathPath) {
            path = config.permissionsEndpoint.learningPathPath;
            data = { learningpathId: entityId };
        }
        let response = await httpRequestSender.post(protocol + '://' + config.permissionsEndpoint.hosts[hostIndex] + path, data, {
            Authorization: `Bearer ${idToken}`
        });
        if (!response || !response.body || response.statusCode !== 200) {
            return reject(ctx);
        }
        ctx.entityId = entityId;
        ctx.entityType = entityType;
        ctx.identityId = identityId;
        ctx.identityAccessLevel = response.body.data;
        await next();
    } catch (e) {
        reject(ctx);
    }
};

function reject(request) {
    request.body = 'Access denied';
    request.status = 403;
}