const constants = require('../../constants');
const DataMapper = require('../common/DataMapper');
const CourseResultsMapper = require('../../mappers/course/resultMapper');

const givenAnswerSupportedQuestionTypes = [
    constants.questionTypes.singleSelectText,
    constants.questionTypes.multipleSelect,
    constants.questionTypes.statement,
    constants.questionTypes.openQuestion,
    constants.questionTypes.textMatching,
    constants.questionTypes.rankingText
];

module.exports = class CourseDataMapper extends DataMapper {
    constructor(localizationManager) {
        super(localizationManager);

        this.staticTexts = {
            reportingInfoNotAvailable: localizationManager.localize('reportingInfoNotAvailable'),
            notFinishedYet: localizationManager.localize('notFinishedYet'),
            noGivenAnswersCaption: localizationManager.localize('noGivenAnswersCaption')
        };

        this.resultMapper = new CourseResultsMapper(localizationManager);
    }

    map(data, structure) {
        let result = this.resultMapper.mapResult(data);
        let mappedResult = super.map(result);
        mappedResult.startedOn = this._getDate(result.startedOn);
        mappedResult.finishedOn = this._getDate(result.finishedOn, this.staticTexts.notFinishedYet);
        mappedResult.details = this._mapResultDetails(result.sections, structure);
        return mappedResult;
    }

    _mapResultDetails(sections, structure) {
        let details = {};
        structure.sections.forEach(structureSection => {
            let section = sections.find(item => structureSection.id === item.id);
            if (!section) {
                return;
            }

            details[`${constants.csv.sectionMark}${section.id}`] = section.score;
            structureSection.questions.forEach(structureQuestion => {
                let question = section.questions.find(item => item.id === structureQuestion.id);
                if (!question) {
                    return;
                }

                details[`${constants.csv.questionMark}${question.id}score`]
                    = this._getQuestionResult(question);
                details[`${constants.csv.questionMark}${question.id}answers`]
                    = this._getQuestionResponse(question);
            });
        }, this);

        return details;
    }

    _getQuestionResult(question) {
        if (!question.hasResult) {
            return this.staticTexts.reportingInfoNotAvailable;
        }
        return question.hasScore ? question.score : '-';
    }

    _getQuestionResponse(question) {
        if (givenAnswerSupportedQuestionTypes.includes(question.questionType)) {
            // hook for ranking text question type
            if (question.hasOwnProperty('isAnswered') && question.score !== 100 && !question.isAnswered) {
                return this.staticTexts.reportingInfoNotAvailable;
            }

            return question.hasResponse ? question.response
                : this.staticTexts.reportingInfoNotAvailable;
        } else if (question.questionType === constants.questionTypes.informationContent) {
            return this.staticTexts.reportingInfoNotAvailable;
        }

        return this.staticTexts.noGivenAnswersCaption.replace('{{questionType}}',
            this.localizationManager.localize(question.questionType));
    }
};