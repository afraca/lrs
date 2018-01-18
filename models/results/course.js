const Result = require('./result');

module.exports = class Course extends Result {
    constructor(spec, localizationManager) {
        super(spec, localizationManager);
        this.attemptId = spec.attemptId;
        this.startedOn = spec.startedOn;
        this.finishedOn = spec.finishedOn;
        this.sections = spec.sections || [];
    }
};