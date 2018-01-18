const _ = require('lodash');

class StatementAnswers {
    constructor(title, isAnswered, isTrue, correctAnswer = {}) {
        this.title = title;
        this.isAnswered = isAnswered;
        this.isTrue = isTrue;
        this.isCorrectTrue = correctAnswer.value;
    }
}

module.exports = function (statement) {
    let responseAnswers = statement.response && statement.response.split('[,]');
    let choices = statement.definition.choices;
    let correctResponsesPatternIds = statement.definition.correctResponsesPattern[0] && statement.definition.correctResponsesPattern[0].split('[,]');

    correctResponsesPatternIds = _.map(correctResponsesPatternIds, item => {
        let temp = item.split('[.]');
        return {
            id: temp[0],
            value: temp[1] === 'true'
        };
    });

    this.answers = [];

    responseAnswers = _.map(responseAnswers,
        answer => {
            let temp = answer.split('[.]');
            return {
                id: temp[0],
                value: temp[1] === 'true'
            };
        });

    this.answers = _.map(choices, choice => {
        let answer = _.find(responseAnswers, a => a.id === choice.id);
        if (_.isNil(answer)) {
            return new StatementAnswers(
                choice.description['en-US'], false, false,
                _.find(
                    correctResponsesPatternIds,
                    item => item.id === choice.id
                )
            );
        }
        return new StatementAnswers(
            choice.description['en-US'], true, answer.value,
            _.find(correctResponsesPatternIds, item => item.id === choice.id)
        );
    });

    this.response = _.flow(
        answers => _.filter(answers, answer => answer.isAnswered),
        answers => _.map(answers, answer => `[${answer.isTrue}] ${answer.title}`)
    )(this.answers).join('; ');
};