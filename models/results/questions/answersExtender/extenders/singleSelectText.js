const _ = require('lodash');

class SingleSelectAnswer {
    constructor(title, selected, isCorrect) {
        this.title = title;
        this.selected = selected;
        this.isCorrect = isCorrect;
    }
}

module.exports = function (statement) {
    let responseIds = statement.response && statement.response.split('[,]');
    let choices = statement.definition.choices;
    let correctResponsesPatternIds = statement.definition.correctResponsesPattern[0] && statement.definition.correctResponsesPattern[0].split('[,]');
    this.answers = [];

    if (_.isNil(responseIds)) {
        this.answers = _.map(choices, choice => new SingleSelectAnswer(
            choice.description['en-US'],
            false,
            _.some(correctResponsesPatternIds, id => choice.id === id)
        ));
    } else {
        this.answers = _.map(choices, choice => new SingleSelectAnswer(
            choice.description['en-US'],
            _.some(responseIds, id => id === choice.id),
            _.some(correctResponsesPatternIds, id => choice.id === id)
        ));
    }
    this.response = _.flow(
        answers => _.filter(answers, answer => answer.selected),
        answers => _.map(answers, answer => answer.title)
    )(this.answers).join('; ');
};