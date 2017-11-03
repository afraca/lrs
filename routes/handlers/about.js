'use strict';

const config = require('../../config');

module.exports = async (req, res) => {
    res.status(200).json({
        version: config.xApiVersion
    });
};