'use strict';

const db = require('../../db');
const validator = require('../../validation/entityStructureValidator');

module.exports = {
    put: async ctx => {
        let entityStructure = ctx.request.body;
        let error = validator.validate(entityStructure);
        if (error) {
            ctx.status = 400;
            ctx.body = error;
            return;
        }

        await db.entityStructures.update({
            entityId: entityStructure.entityId,
            entityType: entityStructure.entityType
        }, {
            entityId: entityStructure.entityId,
            entityType: entityStructure.entityType,
            structure: entityStructure.structure
        }, {
            upsert: true
        });

        ctx.status = 200;
        ctx.body = { message: 'OK' };
    },
    get: async ctx => {
        let entityStructure = await db.entityStructures.findOne({
            entityId: ctx.entityId,
            entityType: ctx.entityType
        }, {
            fields: { _id: 0 }
        });

        if (entityStructure) {
            ctx.status = 200;
            ctx.body = entityStructure.structure;
        } else {
            ctx.status = 404;
            ctx.body = { message: 'Entity structure has not been found by specified criteria' };
        }
    }
};