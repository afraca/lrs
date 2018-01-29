const _ = require('lodash');

class RankingTextAnswer {
    constructor(answeredTitle, correctTitle) {
        this.answeredTitle = answeredTitle || '';
        this.correctTitle = correctTitle || '';
        this.isSameValues =
      this.answeredTitle.toLowerCase() === this.correctTitle.toLowerCase();
    }
}

module.exports = function (statement) {
    let responseIds = statement.response && statement.response.split('[,]');
    let choices = statement.definition.choices;
    let correctResponsesPatternIds =
    statement.definition.correctResponsesPattern[0] &&
    statement.definition.correctResponsesPattern[0].split('[,]');
    this.answers = [];

    if (_.isNil(responseIds) && _.isNil(choices)) {
        this.answers = _.map(
      choices,
      choice =>
        new RankingTextAnswer(
          choice.description['en-US'],
          choice.description['en-US']
        )
    );
    } else if (_.isNil(responseIds)) {
        this.answers = _.map(
      choices,
      (choice, index) =>
        new RankingTextAnswer(
          choice.description['en-US'],
          correctResponsesPatternIds[index]
        )
    );
    } else {
        this.answers = _.map(responseIds, (id, index) => {
            let choice = _.find(
        choices,
        c => c.id.toLowerCase() === id.toLowerCase()
      );
            return new RankingTextAnswer(
        choice.description['en-US'],
        correctResponsesPatternIds[index]
      );
        });
    }
    this.isAnswered = !!_.find(this.answers, answer => !answer.isSameValues);
    this.response = _.map(this.answers, answer => answer.answeredTitle).join(
    '; '
  );
};
