'use strict';

const config = require('../config');

module.exports = async (req, res, next) => {
    const header = 'X-Experience-API-Version';
    let expectedXApiVersion = config.xApiVersion.substring(0, 3);
    if (req.get(header) && req.get(header).substring(0, 3) === expectedXApiVersion) {
        await next();
    } else {
        res.set(header, config.xApiVersion)
            .status(400)
            .send('Invalid \'X-Experience-API-Version\' header was supplied');
    }
};