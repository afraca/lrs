const DataMapper = require('../common/DataMapper');
const LearningPathResultsMapper = require('../../mappers/learningPath/resultMapper');

module.exports = class LearningPathDataMapper extends DataMapper {
    constructor(localizationManager, timezone) {
        super(localizationManager, timezone);
        this.resultMapper = new LearningPathResultsMapper(this.localizationManager);
    }

    map(data) {
        let result = this.resultMapper.mapResult(data);
        let mappedResult = super.map(result);
        mappedResult.timestamp = this._getDate(result.timestamp);
        return mappedResult;
    }
};