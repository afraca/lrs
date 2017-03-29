'use strict';

const config = require('../config');

module.exports = ctx => {
    ctx.body = {
        version: config.xApiVersion
    };
    ctx.status = 200;
};