const FieldProvider = require('../common/FieldProvider');

module.exports = class LearningPathFieldProvider extends FieldProvider {
    getCsvFields() {
        return [...super.getCsvFields(),
            this._getLocalizableField('result', 'result'),
            this._getLocalizableField('score', 'score'),
            this._getLocalizableField('dateTime', 'timestamp')
        ];
    }
};