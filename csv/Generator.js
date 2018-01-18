const json2csv = require('json2csv');
const constants = require('../constants');
const CourseFieldProvider = require('./course/FieldProvider');
const LearningPathFieldProvider = require('./learningPath/FieldProvider');
const CourseDataMapper = require('./course/DataMapper');
const LearningPathDataMapper = require('./learningPath/DataMapper');

module.exports = class Generator {
    constructor(entityStructure, isCourseResults, localizationManager) {
        this.structure = entityStructure && entityStructure.structure;
        let provider = isCourseResults ? new CourseFieldProvider(localizationManager)
            : new LearningPathFieldProvider(localizationManager);
        this.fields = provider.getCsvFields(this.structure);
        this.dataMapper = isCourseResults ? new CourseDataMapper(localizationManager)
            : new LearningPathDataMapper(localizationManager);
    }

    getHeaderRow() {
        return json2csv({
            fields: this.fields,
            defaultValue: constants.csv.defaultValue,
            withBOM: true
        });
    }

    getDataRow(data) {
        return json2csv({
            data: [this.dataMapper.map(data, this.structure)],
            fields: this.fields,
            defaultValue: constants.csv.defaultValue,
            hasCSVColumnTitle: false,
            withBOM: false
        });
    }
};