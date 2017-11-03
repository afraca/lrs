'use strict';

const constants = require('../constants');

module.exports = (err, req, res, next) => {
    let status = 500;
    let result = {
        message: constants.errors.internalServerError
    };

    res.status(status).json(result);
    next(err);
};