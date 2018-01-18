const consts = require('../../constants');
const FieldProvider = require('../common/FieldProvider');

module.exports = class CourseFieldProvider extends FieldProvider {
    getCsvFields(structure) {
        let fields = super.getCsvFields();
        fields.push(
            this._getLocalizableField('courseResult', 'result'),
            this._getLocalizableField('courseScore', 'score'),
            this._getLocalizableField('started', 'startedOn'),
            this._getLocalizableField('finished', 'finishedOn'));

        let sectionShortTitle = this.localizationManager.localize('sectionShortTitle');
        let questionShortTitle = this.localizationManager.localize('questionShortTitle');
        let contentShortTitle = this.localizationManager.localize('contentShortTitle');

        structure.sections.forEach((section, sectionIndex) => {
            fields.push(this._getField(
                `${sectionShortTitle}${sectionIndex + 1}: ${section.title}`.replace(/[,]/g, '","'),
                `details.${consts.csv.sectionMark}${section.id}`
            ));

            section.questions.forEach((question, questionIndex) => {
                fields.push(this._getField(
                    `${sectionShortTitle}${sectionIndex + 1} ${question.type === 'informationContent' ? contentShortTitle : questionShortTitle}${questionIndex + 1}: ${question.title}`.replace(/[,]/g, '","'),
                    `details.${consts.csv.questionMark}${question.id}score`
                ));
                fields.push(this._getField(
                    this.localizationManager.localize('givenAnswer'),
                    `details.${consts.csv.questionMark}${question.id}answers`
                ));
            });
        }, this);

        return fields;
    }
};