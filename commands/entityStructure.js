'use strict';

const db = require('../db');

module.exports = {
    async get(id, type) {
        let structureCriteria = {
            entityId: id
        };

        if (type) {
            structureCriteria.entityType = type;
        }

        let entityStructure = await db.entityStructures.findOne(structureCriteria, {
            fields: { _id: 0 }
        });

        if (!entityStructure || !entityStructure.structure) { return null; }

        entityStructure.structure.sections = entityStructure.structure.sections.filter(
            section => section.questions.length);
        return entityStructure;
    }
};