const constants = require('../../constants');

module.exports = class Section {
    constructor(spec, questions) {
        this.id = spec.id.substr(spec.id.length - 32);// guid length
        this.title = spec.definition.name['en-US'];
        this.score = spec.score;
        this.inProgress = spec.verb === constants.statementsVerbs.progressed;
        this.questions = questions || [];
    }
};