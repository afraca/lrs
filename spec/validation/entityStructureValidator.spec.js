'use strict';

const validator = require('../../validation/entityStructureValidator');

describe('[entityStructureValidator]', () => {
    describe('validate:', () => {
        describe('when entityId is not defined', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withEntityId(undefined),
                    '"entityId" is required', 'entityId');
            });
        });

        describe('when entityId is not a string', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withEntityId(0),
                    '"entityId" must be a string', 'entityId');
            });
        });

        describe('when entityType is not defined', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withEntityType(undefined),
                    '"entityType" is required', 'entityType');
            });
        });

        describe('when entityType is not a string', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withEntityType(123),
                    '"entityType" must be a string', 'entityType');
            });
        });

        describe('when entity type is not course', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withEntityType('kursik'),
                    '"entityType" must be one of [course]', 'entityType');
            });
        });

        describe('when entity structure is not defined', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withStructure(undefined),
                    '"structure" is required', 'structure');
            });
        });

        describe('when title is not defined', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withStructureTitle(undefined),
                    '"title" is required', 'structure/title');
            });
        });

        describe('when title is not a string', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withStructureTitle(123),
                    '"title" must be a string', 'structure/title');
            });
        });

        describe('when sections is not defined', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withSections(undefined),
                    '"sections" is required', 'structure/sections');
            });
        });

        describe('when sections is not an array', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withSections({}),
                    '"sections" must be an array', 'structure/sections');
            });
        });

        describe('when structure section id is not defined', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withSectionId(undefined),
                    '"id" is required', 'structure/sections/0/id');
            });
        });

        describe('when section id is not a string', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withSectionId(123),
                    '"id" must be a string', 'structure/sections/0/id');
            });
        });

        describe('when section title is not defined', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withSectionTitle(undefined),
                    '"title" is required', 'structure/sections/0/title');
            });
        });

        describe('when section title is not a string', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withSectionTitle(123),
                    '"title" must be a string', 'structure/sections/0/title');
            });
        });

        describe('when questions is not defined', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withQuestions(undefined),
                    '"questions" is required', 'structure/sections/0/questions');
            });
        });

        describe('when questions is not an array', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withQuestions({}),
                    '"questions" must be an array', 'structure/sections/0/questions');
            });
        });

        describe('when question id is not defined', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withQuestionId(undefined),
                    '"id" is required', 'structure/sections/0/questions/0/id');
            });
        });

        describe('when question id is not a string', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withQuestionId({}),
                    '"id" must be a string', 'structure/sections/0/questions/0/id');
            });
        });

        describe('when question title is not defined', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withQuestionTitle(undefined),
                    '"title" is required', 'structure/sections/0/questions/0/title');
            });
        });

        describe('when question title is not a string', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withQuestionTitle({}),
                    '"title" must be a string', 'structure/sections/0/questions/0/title');
            });
        });

        describe('when question type is not defined', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withQuestionType(undefined),
                    '"type" is required', 'structure/sections/0/questions/0/type');
            });
        });

        describe('when question type is not a string', () => {
            it('should return error', () => {
                shouldValidate(entityStructure()
                    .withQuestionType(132),
                    '"type" must be a string', 'structure/sections/0/questions/0/type');
            });
        });

        describe('when few fields are invalid', () => {
            it('should return all errors', () => {
                let result = validator.validate(
                    entityStructure()
                    .withEntityId(undefined)
                    .withSections(undefined)
                    .value()
                );
                expect(result.errors.length).toBe(2);
            });
        });

        it('should return null', () => {
            expect(validator.validate(entityStructure().value())).toBeNull();
        });
    });
});

class EntityStructure {
    constructor() {
        this._value = {
            entityId: 'id',
            entityType: 'course',
            structure: {
                title: 'title',
                sections: [{
                    id: 'id',
                    title: 'title',
                    questions: [{
                        id: 'id',
                        title: 'title',
                        type: 'unknown'
                    }]
                }]
            }
        };
    }
    withEntityId(entityId) {
        this._value.entityId = entityId;
        return this;
    }
    withEntityType(entityType) {
        this._value.entityType = entityType;
        return this;
    }
    withStructure(structure) {
        this._value.structure = structure;
        return this;
    }
    withStructureTitle(title) {
        this._value.structure.title = title;
        return this;
    }
    withSections(sections) {
        this._value.structure.sections = sections;
        return this;
    }
    withSectionId(id) {
        this._value.structure.sections[0].id = id;
        return this;
    }
    withSectionTitle(title) {
        this._value.structure.sections[0].title = title;
        return this;
    }
    withQuestions(questions) {
        this._value.structure.sections[0].questions = questions;
        return this;
    }
    withQuestionId(id) {
        this._value.structure.sections[0].questions[0].id = id;
        return this;
    }
    withQuestionTitle(title) {
        this._value.structure.sections[0].questions[0].title = title;
        return this;
    }
    withQuestionType(type) {
        this._value.structure.sections[0].questions[0].type = type;
        return this;
    }
    value() {
        return this._value;
    }
}

function entityStructure() {
    return new EntityStructure();
}

function shouldValidate(structure, errorMessage, path) {
    shouldHaveSingleValidationError(validator.validate(structure.value()), errorMessage, path);
}

function shouldHaveSingleValidationError(result, message, path) {
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].message).toBe(message);
    expect(result.errors[0].path).toEqual(path);
}