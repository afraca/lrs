 'use strict';

 const config = require('../config');
 const httpRequestSender = require('../utils/httpRequestSender');
 const idTokenAuth = require('./idTokenAuth');

 module.exports = async (req, res, next) => {
     const accessToken = req.get('X-Access-Token');
     if (accessToken) {
         let info = await httpRequestSender.get(`https://${config.tokens.uri}/${accessToken}`, {
             'X-Api-Key': config.tokensApiKey
         });

         if (!info || info.revoked || !info.entityId || !info.entityType || info.scopes.indexOf('read') === -1 || !info.createdBy) {
             res.status(403).send('Access denied');
         }

         req.entityId = info.entityId;
         req.entityType = info.entityType;
         req.identityId = info.createdBy;
         await next();
         return;
     }

     idTokenAuth(req, res, next);
 };