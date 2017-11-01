'use strict';

const handler = require('../../../routes/handlers/results');
const command = require('../../../commands/results');

describe('route handler [results]:', () => {
    describe('archive:', () => {
        let entityId = 'someId';
        let attemptId = 'someAttemptId';
        let ctx = {};

        beforeEach(() => {
            ctx.entityId = entityId;
        });

        describe('when attempt with specified id is not found', () => {
            beforeEach(() => {
                let promise = Promise.resolve(null);
                spyOn(command, 'getIdByAttemptId').and.returnValue(promise);
            });

            it('should set 404 status', done => (async () => {
                await handler.archive(ctx, attemptId);
                expect(ctx.status).toBe(404);
            })().then(done));

            it('should set body message', done => (async () => {
                await handler.archive(ctx, attemptId);
                expect(ctx.body).toEqual({ message: 'Attempt with such id has not been found' });
            })().then(done));
        });

        describe('when attempt id !== entity id', () => {
            beforeEach(() => {
                let promise = Promise.resolve({ id: 'XXX' });
                spyOn(command, 'getIdByAttemptId').and.returnValue(promise);
            });

            it('should set 403 status', done => (async () => {
                await handler.archive(ctx, attemptId);
                expect(ctx.status).toBe(403);
            })().then(done));

            it('should set body message', done => (async () => {
                await handler.archive(ctx, attemptId);
                expect(ctx.body).toEqual({ message: 'You dont have permissions for this operation' });
            })().then(done));
        });

        describe('when attempt id === entity id', () => {
            beforeEach(() => {
                let promise = Promise.resolve({ id: entityId });
                spyOn(command, 'getIdByAttemptId').and.returnValue(promise);
                let archivePromise = Promise.resolve(true);
                spyOn(command, 'markAsArchived').and.returnValue(archivePromise);
            });

            it('should mark attempt as archived', done => (async () => {
                await handler.archive(ctx, attemptId);
                expect(command.markAsArchived).toHaveBeenCalledWith(attemptId);
            })().then(done));

            it('should set 200 status', done => (async () => {
                await handler.archive(ctx, attemptId);
                expect(ctx.status).toBe(200);
            })().then(done));

            it('should set body message', done => (async () => {
                await handler.archive(ctx, attemptId);
                expect(ctx.body).toEqual({ message: 'OK' });
            })().then(done));
        });
    });

    describe('unarchive:', () => {
        let entityId = 'someId';
        let attemptId = 'someAttemptId';
        let ctx = {};

        beforeEach(() => {
            ctx.entityId = entityId;
        });

        describe('when attempt with specified id is not found', () => {
            beforeEach(() => {
                let promise = Promise.resolve(null);
                spyOn(command, 'getIdByAttemptId').and.returnValue(promise);
            });

            it('should set 404 status', done => (async () => {
                await handler.unarchive(ctx, attemptId);
                expect(ctx.status).toBe(404);
            })().then(done));

            it('should set body message', done => (async () => {
                await handler.unarchive(ctx, attemptId);
                expect(ctx.body).toEqual({ message: 'Attempt with such id has not been found' });
            })().then(done));
        });

        describe('when attempt id !== entity id', () => {
            beforeEach(() => {
                let promise = Promise.resolve({ id: 'XXX' });
                spyOn(command, 'getIdByAttemptId').and.returnValue(promise);
            });

            it('should set 403 status', done => (async () => {
                await handler.unarchive(ctx, attemptId);
                expect(ctx.status).toBe(403);
            })().then(done));

            it('should set body message', done => (async () => {
                await handler.unarchive(ctx, attemptId);
                expect(ctx.body).toEqual({ message: 'You dont have permissions for this operation' });
            })().then(done));
        });

        describe('when attempt id === entity id', () => {
            beforeEach(() => {
                let promise = Promise.resolve({ id: entityId });
                spyOn(command, 'getIdByAttemptId').and.returnValue(promise);
                let unarchivePromise = Promise.resolve(true);
                spyOn(command, 'unmarkAsArchived').and.returnValue(unarchivePromise);
            });

            it('should unmark attempt as archived', done => (async () => {
                await handler.unarchive(ctx, attemptId);
                expect(command.unmarkAsArchived).toHaveBeenCalledWith(attemptId);
            })().then(done));

            it('should set 200 status', done => (async () => {
                await handler.unarchive(ctx, attemptId);
                expect(ctx.status).toBe(200);
            })().then(done));

            it('should set body message', done => (async () => {
                await handler.unarchive(ctx, attemptId);
                expect(ctx.body).toEqual({ message: 'OK' });
            })().then(done));
        });
    });
});