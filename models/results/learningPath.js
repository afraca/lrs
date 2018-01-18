const Result = require('./result');

module.exports = class LearningPath extends Result {
    constructor(spec, localizationManager) {
        super(spec, localizationManager);
        this.timestamp = spec.timestamp;
    }
};