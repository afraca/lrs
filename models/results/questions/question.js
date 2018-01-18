const _ = require('lodash');
const answersExtender = require('./answersExtender');

module.exports = class Question {
    constructor(spec, localizationManager) {
        this.id = spec.id.substr(spec.id.length - 32); // guid length
        this.title = spec.name;
        this.questionType = spec.questionType;
        this.hasScore = _.isNumber(spec.score);
        this.score = this.hasScore ? spec.score : null;
        this.response = spec.response;
        this.isSurvey = !!spec.isSurvey;
        answersExtender.call(this, spec, localizationManager);
        this.hasResponse = _.isString(this.response);
        this.hasResult = this.hasScore || this.hasResponse;
    }
};