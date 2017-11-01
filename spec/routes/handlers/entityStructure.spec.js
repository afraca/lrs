'use strict';

const handler = require('../../../routes/handlers/entityStructure');
const validator = require('../../../validation/entityStructureValidator');
const db = require('../../../db');

describe('route handler [entityStructure]:', () => {
    describe('put:', () => {
        let ctx = {
            request: {
                body: null
            }
        };

        describe('when entity structure is not valid', () => {
            let error = { message: 'error' };
            beforeEach(() => {
                spyOn(validator, 'validate').and.returnValue(error);
            });

            it('should set 400 status', done => (async () => {
                await handler.put(ctx);
                expect(ctx.status).toBe(400);
            })().then(done));

            it('should set body error', done => (async () => {
                await handler.put(ctx);
                expect(ctx.body).toBe(error);
            })().then(done));
        });

        describe('when entity structure is valid', () => {
            let structure = {
                entityId: 'id',
                entityType: 'type',
                structure: {
                    sections: []
                }
            };

            beforeEach(() => {
                ctx.request.body = structure;
                let promise = Promise.resolve(true);
                spyOn(db.entityStructures, 'update').and.returnValue(promise);
                spyOn(validator, 'validate').and.returnValue(null);
            });

            it('should update entity structure in db', done => (async () => {
                await handler.put(ctx);
                expect(db.entityStructures.update).toHaveBeenCalledWith({
                    entityId: structure.entityId,
                    entityType: structure.entityType
                }, {
                    entityId: structure.entityId,
                    entityType: structure.entityType,
                    structure: structure.structure
                }, {
                    upsert: true
                });
            })().then(done));

            it('should set 200 status', done => (async () => {
                await handler.put(ctx);
                expect(ctx.status).toBe(200);
            })().then(done));

            it('should set body message', done => (async () => {
                await handler.put(ctx);
                expect(ctx.body).toEqual({ message: 'OK' });
            })().then(done));
        });
    });

    describe('get:', () => {
        let entityId = 'entityId';
        let entityType = 'entityType';
        let ctx = {
            entityId,
            entityType
        };
        let structure = {
            entityId: 'id',
            entityType: 'type',
            structure: {
                title: 'title',
                sections: []
            }
        };

        it('should load entity structure from db', done => (async () => {
            spyOn(db.entityStructures, 'findOne').and.returnValue(Promise.resolve());
            await handler.get(ctx);
            expect(db.entityStructures.findOne).toHaveBeenCalledWith({
                entityId: ctx.entityId,
                entityType: ctx.entityType
            }, {
                fields: { _id: 0 }
            });
        })().then(done));

        describe('when entity structure is found', () => {
            beforeEach(() => {
                let promise = Promise.resolve(structure);
                spyOn(db.entityStructures, 'findOne').and.returnValue(promise);
            });

            it('should set 200 status', done => (async () => {
                await handler.get(ctx);
                expect(ctx.status).toBe(200);
            })().then(done));

            it('should set body structure', done => (async () => {
                await handler.get(ctx);
                expect(ctx.body).toBe(structure.structure);
            })().then(done));
        });

        describe('when entity structure is not found', () => {
            beforeEach(() => {
                let promise = Promise.resolve(null);
                spyOn(db.entityStructures, 'findOne').and.returnValue(promise);
            });

            it('should set 404 status', done => (async () => {
                await handler.get(ctx);
                expect(ctx.status).toBe(404);
            })().then(done));

            it('should set body message', done => (async () => {
                await handler.get(ctx);
                expect(ctx.body).toEqual({ message: 'Entity structure has not been found by specified criteria' });
            })().then(done));
        });
    });
});