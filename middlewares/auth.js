'use strict';

const decodeJWT = require('jwt-decode');
const config = require('../config');
const constants = require('../constants');
const db = require('../db');
const httpRequestSender = require('../utils/httpRequestSender');

module.exports = async (ctx, next) => {
    const accessToken = ctx.get('X-Access-Token');
    if (accessToken) {
        let info = await db.tokens.findOne({ id: accessToken });
        if (!info || !info.entityId || !info.entityType || !info.scopes.read) {
            return reject(ctx);
        }
        ctx.entityId = info.entityId;
        ctx.entityType = info.entityType;
        await next();
        return;
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
        if (!response || response.statusCode !== 200) {
            return reject(ctx);
        }
        ctx.entityId = entityId;
        ctx.entityType = entityType;
        await next();
    } catch (e) {
        reject(ctx);
    }
};

function reject(request) {
    request.body = 'Access denied';
    request.status = 403;
}