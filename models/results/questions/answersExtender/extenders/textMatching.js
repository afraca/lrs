const _ = require('lodash');

class TextMatchingAnswer {
    constructor(key, value, correctValue) {
        this.key = key;
        this.value = value;
        this.correctValue = correctValue;
    }
}

module.exports = function (statement, localizationManager) {
    let responseIds = statement.response.split('[,]');
    let sources = statement.definition.source;
    let targets = statement.definition.target;

    if (_.isUndefined(sources) || _.isUndefined(targets)) {
        return undefined;
    }

    let correctResponsesPatternIds = statement.definition.correctResponsesPattern[0] && statement.definition.correctResponsesPattern[0].split('[,]');
    this.answers = [];

    responseIds = _.map(responseIds, resId => {
        let temp = resId.split('[.]');
        return {
            sourceId: temp[0],
            targetId: temp[1]
        };
    });

    correctResponsesPatternIds = _.map(correctResponsesPatternIds, resId => {
        let temp = resId.split('[.]');
        return {
            sourceId: temp[0],
            targetId: temp[1]
        };
    });

    sources.forEach(source => {
        let givenAnswer = responseIds.filter(res => res.sourceId === source.id)[0] || {};
        let correctAnswer = correctResponsesPatternIds.filter(
            corRes => corRes.sourceId === source.id
        )[0] || {};
        let value = targets.filter(target => target.id === givenAnswer.targetId)[0];
        let correctValue = targets.filter(target => target.id === correctAnswer.targetId)[0];
        this.answers.push(new TextMatchingAnswer(
            source.description['en-US'],
            value ? value.description['en-US'] :
                localizationManager.localize('reportingInfoNotAvailable'),
            correctValue && correctValue.description['en-US']
        ));
    });
    this.response = _.map(this.answers, answer => `${answer.key}->${answer.value}`).join('; ');
};