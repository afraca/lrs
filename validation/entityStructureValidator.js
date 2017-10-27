'use strict';

const joi = require('joi');
const schemaValidator = require('./schemaValidator');

module.exports = {
    validate(value) {
        return schemaValidator.validate(value, joi.object({
            entityId: joi.string().required(),
            entityType: joi.string().valid('course').required(),
            structure: joi.object({
                title: joi.string().required(),
                sections: joi.array().items(joi.object({
                    id: joi.string().required(),
                    title: joi.string().required(),
                    questions: joi.array().items(joi.object({
                        id: joi.string().required(),
                        title: joi.string().required()
                    })).required()
                })).required()
            }).required()
        }));
    }
};