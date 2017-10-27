'use strict';

const validator = require('../../validation/entityStructureValidator');

describe('[entityStructureValidator]', () => {
    describe('validate:', () => {
        describe('when entityId is not defined', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: undefined,
                    entityType: 'course',
                    structure: {
                        title: 'title',
                        sections: []
                    }
                });
                shouldHaveSingleValidationError(result, '"entityId" is required', 'entityId');
            });
        });

        describe('when entityId is not a string', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: 0,
                    entityType: 'course',
                    structure: {
                        title: 'title',
                        sections: []
                    }
                });
                shouldHaveSingleValidationError(result, '"entityId" must be a string', 'entityId');
            });
        });

        describe('when entityType is not defined', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: 'id',
                    entityType: undefined,
                    structure: {
                        title: 'title',
                        sections: []
                    }
                });
                shouldHaveSingleValidationError(result, '"entityType" is required', 'entityType');
            });
        });

        describe('when entityType is not a string', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: 'id',
                    entityType: 0,
                    structure: {
                        title: 'title',
                        sections: []
                    }
                });
                shouldHaveSingleValidationError(result, '"entityType" must be a string', 'entityType');
            });
        });

        describe('when entity type is not course', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: 'id',
                    entityType: 'kursik',
                    structure: {
                        title: 'title',
                        sections: []
                    }
                });
                shouldHaveSingleValidationError(result, '"entityType" must be one of [course]', 'entityType');
            });
        });

        describe('when entity structure is not defined', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: 'id',
                    entityType: 'course',
                    structure: undefined
                });
                shouldHaveSingleValidationError(result, '"structure" is required', 'structure');
            });
        });

        describe('when entity structure title is not defined', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: 'id',
                    entityType: 'course',
                    structure: {
                        title: undefined,
                        sections: []
                    }
                });
                shouldHaveSingleValidationError(result, '"title" is required', 'structure/title');
            });
        });

        describe('when entity structure title is not a string', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: 'id',
                    entityType: 'course',
                    structure: {
                        title: 0,
                        sections: []
                    }
                });
                shouldHaveSingleValidationError(result, '"title" must be a string', 'structure/title');
            });
        });

        describe('when entity structure sections is not defined', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: 'id',
                    entityType: 'course',
                    structure: {
                        title: 'title',
                        sections: undefined
                    }
                });
                shouldHaveSingleValidationError(result, '"sections" is required', 'structure/sections');
            });
        });

        describe('when entity structure sections is not an array', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: 'id',
                    entityType: 'course',
                    structure: {
                        title: 'title',
                        sections: {}
                    }
                });
                shouldHaveSingleValidationError(result, '"sections" must be an array', 'structure/sections');
            });
        });

        describe('when structure section id is not defined', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: 'id',
                    entityType: 'course',
                    structure: {
                        title: 'title',
                        sections: [{
                            id: undefined,
                            title: 'title',
                            questions: []
                        }]
                    }
                });
                shouldHaveSingleValidationError(result, '"id" is required', 'structure/sections/0/id');
            });
        });

        describe('when structure section id is not defined', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: 'id',
                    entityType: 'course',
                    structure: {
                        title: 'title',
                        sections: [{
                            id: 0,
                            title: 'title',
                            questions: []
                        }]
                    }
                });
                shouldHaveSingleValidationError(result, '"id" must be a string', 'structure/sections/0/id');
            });
        });

        describe('when structure section title is not defined', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: 'id',
                    entityType: 'course',
                    structure: {
                        title: 'title',
                        sections: [{
                            id: 'id',
                            title: undefined,
                            questions: []
                        }]
                    }
                });
                shouldHaveSingleValidationError(result, '"title" is required', 'structure/sections/0/title');
            });
        });

        describe('when section title is not a string', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: 'id',
                    entityType: 'course',
                    structure: {
                        title: 'title',
                        sections: [{
                            id: 'id',
                            title: 0,
                            questions: []
                        }]
                    }
                });
                shouldHaveSingleValidationError(result, '"title" must be a string', 'structure/sections/0/title');
            });
        });

        describe('when structure questions is not defined', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: 'id',
                    entityType: 'course',
                    structure: {
                        title: 'title',
                        sections: [{
                            id: 'id',
                            title: 'title',
                            questions: undefined
                        }]
                    }
                });
                shouldHaveSingleValidationError(result, '"questions" is required', 'structure/sections/0/questions');
            });
        });

        describe('when structure questions is not an array', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: 'id',
                    entityType: 'course',
                    structure: {
                        title: 'title',
                        sections: [{
                            id: 'id',
                            title: 'title',
                            questions: {}
                        }]
                    }
                });
                shouldHaveSingleValidationError(result, '"questions" must be an array', 'structure/sections/0/questions');
            });
        });

        describe('when structure question id is not defined', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: 'id',
                    entityType: 'course',
                    structure: {
                        title: 'title',
                        sections: [{
                            id: 'id',
                            title: 'title',
                            questions: [{
                                id: undefined,
                                title: 'title'
                            }]
                        }]
                    }
                });
                shouldHaveSingleValidationError(result, '"id" is required', 'structure/sections/0/questions/0/id');
            });
        });

        describe('when structure question id is not a string', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: 'id',
                    entityType: 'course',
                    structure: {
                        title: 'title',
                        sections: [{
                            id: 'id',
                            title: 'title',
                            questions: [{
                                id: 0,
                                title: 'title'
                            }]
                        }]
                    }
                });
                shouldHaveSingleValidationError(result, '"id" must be a string', 'structure/sections/0/questions/0/id');
            });
        });

        describe('when structure question title is not defined', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: 'id',
                    entityType: 'course',
                    structure: {
                        title: 'title',
                        sections: [{
                            id: 'id',
                            title: 'title',
                            questions: [{
                                id: 'id',
                                title: undefined
                            }]
                        }]
                    }
                });
                shouldHaveSingleValidationError(result, '"title" is required', 'structure/sections/0/questions/0/title');
            });
        });

        describe('when structure question title is not a string', () => {
            it('should return error', () => {
                let result = validator.validate({
                    entityId: 'id',
                    entityType: 'course',
                    structure: {
                        title: 'title',
                        sections: [{
                            id: 'id',
                            title: 'title',
                            questions: [{
                                id: 'id',
                                title: 0
                            }]
                        }]
                    }
                });
                shouldHaveSingleValidationError(result, '"title" must be a string', 'structure/sections/0/questions/0/title');
            });
        });

        describe('when few fields are invalid', () => {
            it('should return all errors', () => {
                let result = validator.validate({
                    entityId: undefined,
                    entityType: undefined,
                    structure: {
                        title: 'title',
                        sections: [{
                            id: 'id',
                            title: 'title',
                            questions: [{
                                id: 'id',
                                title: 'title'
                            }]
                        }]
                    }
                });
                expect(result.errors.length).toBe(2);
            });
        });

        it('should return null', () => {
            let result = validator.validate({
                entityId: 'id',
                entityType: 'course',
                structure: {
                    title: 'title',
                    sections: [{
                        id: 'id',
                        title: 'title',
                        questions: [{
                            id: 'id',
                            title: 'title'
                        }]
                    }]
                }
            });
            expect(result).toBeNull();
        });
    });
});


function shouldHaveSingleValidationError(result, message, path) {
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].message).toBe(message);
    expect(result.errors[0].path).toEqual(path);
}