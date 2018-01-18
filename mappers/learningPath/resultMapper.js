const constants = require('../../constants');
const Statement = require('../../models/statement');
const LearningPathResult = require('../../models/results/learningPath');
const ResultStatus = require('../../models/results/resultStatus');

module.exports = class {
    constructor(localizationManager) {
        this.localizationManager = localizationManager;
    }

    mapResult(statementSpec) {
        let resultStatement = new Statement(statementSpec);

        let resultSpec = {
            entityTitle: resultStatement.definition.name['en-US'],
            actor: resultStatement.actor,
            timestamp: resultStatement.date,
            score: resultStatement.score,
            status: ResultStatus.inProgress
        };

        resultSpec.status = resultStatement.verb === constants.statementsVerbs.passed ?
            ResultStatus.passed : ResultStatus.failed;

        return new LearningPathResult(resultSpec, this.localizationManager);
    }
};