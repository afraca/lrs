const _ = require('lodash');
const constants = require('../../constants');
const Statement = require('../../models/statement');
const CourseResult = require('../../models/results/course');
const SectionResult = require('../../models/results/section');
const QuestionResult = require('../../models/results/questions/question');
const ResultStatus = require('../../models/results/resultStatus');

module.exports = class {
    constructor(localizationManager) {
        this.localizationManager = localizationManager;
    }

    mapResult(resultSpec) {
        let resultStatement = {
            root: mapStatements(resultSpec.root),
            embeded: _.map(resultSpec.embeded, embededStatementsGroup => (
                embededStatementsGroup.root ? {
                    root: mapStatements(embededStatementsGroup.root),
                    answered: mapStatements(embededStatementsGroup.answered),
                    experienced: mapStatements(embededStatementsGroup.experienced)
                } : null)
            )
        };

        let resultGroup = getResultGroup(resultStatement);

        return map(
            resultGroup.startedStatement,
            resultGroup.progressedStatement,
            resultGroup.sections,
            this.localizationManager
        );
    }
};

function getResultGroup(statementGroup) {
    let startedStatement = _.find(statementGroup.root,
        statement => statement.verb === constants.statementsVerbs.started);

    if (!startedStatement) {
        return null;
    }

    let progressedStatement = _.find(statementGroup.root, statement =>
        _.find([constants.statementsVerbs.failed, constants.statementsVerbs.passed],
            verb => verb === statement.verb));

    if (!progressedStatement) {
        let progressed = _.sortBy(_.filter(statementGroup.root, statement =>
            statement.verb === constants.statementsVerbs.progressed),
            statement => -statement.date.getTime())[0];
        progressedStatement = progressed;
    }

    let sections = getSections(statementGroup.embeded);

    return {
        startedStatement,
        progressedStatement,
        sections
    };
}

function getSections(embededStatements) {
    let sections = embededStatements.map(embededStatement => {
        let latestDate = new Date(Math.max.apply(
            null,
            embededStatement.root.map(statement => new Date(statement.date))
        ));
        if (!latestDate) {
            return null;
        }
        let section = embededStatement.root.find(
            statement => statement.date.setMilliseconds(0) === latestDate.setMilliseconds(0)
        );
        if (!section) {
            return null;
        }
        section.questions = getContentAndQuestions(
            embededStatement.answered,
            embededStatement.experienced
        );
        return section;
    });
    return sections.filter(section => section != null);
}

function getContentAndQuestions(answeredStatements, experiencedStatements) {
    let statements = [];
    answeredStatements = answeredStatements || [];
    experiencedStatements = experiencedStatements || [];
    let groupedAnsweredStatements = _.orderBy(
        answeredStatements.concat(experiencedStatements),
        s => new Date(s.date), ['desc']);
    groupedAnsweredStatements = _.groupBy(
        groupedAnsweredStatements,
        s => s.id);

    statements = _.map(
        _.values(groupedAnsweredStatements),
        groupedItem => groupedItem.length === 1 ?
            groupedItem[0] :
            _.max(groupedItem, gi => gi.score)
    );
    return statements.filter(s => s !== null || s !== undefined);
}

function map(startedStatement, progressedStatement, sectionsStatements, localizationManager) {
    let resultSpec = {
        attemptId: startedStatement.attemptId,
        entityTitle: startedStatement.definition.name['en-US'],
        actor: startedStatement.actor,
        startedOn: startedStatement.date,
        finishedOn: null,
        score: 0,
        status: ResultStatus.inProgress,
        sections: []
    };

    if (!progressedStatement) {
        return new CourseResult(resultSpec, localizationManager);
    }

    resultSpec.score = progressedStatement.score;
    let isFailed = progressedStatement.verb === constants.statementsVerbs.failed;
    let isPassed = progressedStatement.verb === constants.statementsVerbs.passed;
    if (isPassed || isFailed) {
        resultSpec.finishedOn = progressedStatement.date;
        resultSpec.status = isPassed ? ResultStatus.passed : ResultStatus.failed;
    }

    if (sectionsStatements) {
        resultSpec.sections = sectionsStatements.map(s =>
            new SectionResult(s, s.questions.map(q => new QuestionResult(q, localizationManager)))
        );
    }

    return new CourseResult(resultSpec, localizationManager);
}

function mapStatements(statements) {
    return _.map(statements, statement => new Statement(statement));
}