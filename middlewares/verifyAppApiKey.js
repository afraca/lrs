'use strict';

const config = require('../config');

module.exports = async (req, res, next) => {
    const header = 'X-API-Key';
    if (req.get(header) === config.appApiKey) {
        await next();
    } else {
        res.status(403).send('Invalid \'X-Analytics-API-Key\' header was supplied');
    }
};