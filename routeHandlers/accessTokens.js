'use strict';

const uuid = require('uuid');
const db = require('../db');
const config = require('../config');
const constants = require('../constants');

module.exports = {
    async getTokens(ctx) {
        var tokens = await db.tokens.find({ entityId: ctx.entityId }, { fields: { _id: 0 } });
        ctx.body = { tokens, ownerAccessLevel: ctx.identityAccessLevel };
        ctx.status = 200;
    },
    async revokeToken(ctx, tokenId) {
        await db.tokens.update({ id: tokenId }, { $set: { revoked: true } });
        ctx.body = { success: true };
        ctx.status = 200;
    },
    async enableToken(ctx, tokenId) {
        if (ctx.identityAccessLevel < constants.accessTypes.academy) {
            ctx.body = 'Access denied';
            ctx.status = 403;
            return;
        }
        if (tokenId) {
            await db.tokens.update({ id: tokenId }, { $set: { revoked: false } });
        } else {
            let token = {
                id: uuid.v4().split('-').join(''),
                revoked: false,
                entityId: ctx.entityId,
                entityType: ctx.entityType,
                scopes: ['read'],
                createdBy: ctx.identityId
            };
            await db.tokens.insert(token);
            tokenId = token.id;
        }
        ctx.body = { id: tokenId };
        ctx.status = 200;
    },
    async revokeAllTokens(ctx) {
        const apiKey = ctx.get('X-API-Key');
        if (apiKey === config.apiKey) {
            const owner = ctx.request.body.userEmail;
            if (owner) {
                await db.tokens.update({
                    createdBy: owner
                }, {
                    $set: { revoked: true }
                }, {
                    multi: true
                });
            }
        }
        ctx.body = { success: true };
        ctx.status = 200;
    }
};