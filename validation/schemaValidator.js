'use strict';

const joi = require('joi');

module.exports = {
    validate(value, schema) {
        let validationResult = joi.validate(value, schema, {
            abortEarly: false
        });

        if (!validationResult.error) {
            return null;
        }

        let result = {
            errors: []
        };

        validationResult.error.details.forEach(e => result.errors.push({
            message: e.message,
            path: e.path.join('/')
        }));

        return result;
    }
};