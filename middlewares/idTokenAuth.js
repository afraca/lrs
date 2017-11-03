'use strict';

const config = require('../config');
const httpRequestSender = require('../utils/httpRequestSender');
const constants = require('../constants');
const decodeJWT = require('jwt-decode');

module.exports = async (req, res, next) => {
    const idToken = req.get('X-Id-Token');
    const entityId = req.get('X-Entity-Id');
    const entityType = req.get('X-Entity-Type');
    if (!idToken || !entityId || !entityType) {
        return reject(res);
    }
    try {
        let token = decodeJWT(idToken);
        let issuer = token.iss;
        let identityId = token.unique_name;
        if (!isKnownIssuer(issuer)) {
            return reject(res);
        }
        let path = config.permissionsEndpoint.coursePath;
        let data = { courseId: entityId };
        if (entityType === constants.entityTypes.learningPath) {
            path = config.permissionsEndpoint.learningPathPath;
            data = { learningpathId: entityId };
        }
        let response;
        if (issuer === 'localhost') {
            response = { body: { data: constants.accessTypes.academy } };
        } else {
            response = await httpRequestSender.post(`https://${issuer}${path}`, data, {
                Authorization: `Bearer ${idToken}`
            });
            if (!response || !response.body || response.statusCode !== 200) {
                return reject(res);
            }
        }
        req.entityId = entityId;
        req.entityType = entityType;
        req.identityId = identityId;
        req.identityAccessLevel = response.body.data;
        await next();
    } catch (e) {
        reject(res);
    }
};

function isKnownIssuer(issuer) {
    const knownIssuers = config.permissionsEndpoint.hosts;
    for (let knownIssuer of knownIssuers) {
        if (knownIssuer instanceof RegExp) {
            if (knownIssuer.test(issuer)) {
                return true;
            }
        } else if (knownIssuer === issuer) {
            return true;
        }
    }
    return false;
}

function reject(res) {
    res.status(403).send('Access denied');
}