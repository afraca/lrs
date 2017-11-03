'use strict';

const db = require('../../db');
const validator = require('../../validation/entityStructureValidator');

module.exports = {
    put: async (req, res) => {
        let entityStructure = req.body;
        let error = validator.validate(entityStructure);
        if (error) {
            res.status(400).send(error);
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

        res.status(200).json({ message: 'OK' });
    },
    get: async (req, res) => {
        let entityStructure = await db.entityStructures.findOne({
            entityId: req.entityId,
            entityType: req.entityType
        }, {
            fields: { _id: 0 }
        });

        if (entityStructure) {
            res.status(200).json(entityStructure.structure);
        } else {
            res.status(404).json({ message: 'Entity structure has not been found by specified criteria' });
        }
    }
};