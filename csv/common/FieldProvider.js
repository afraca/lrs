module.exports = class FieldProvider {
    constructor(localizationManager) {
        this.localizationManager = localizationManager;
    }

    getCsvFields() {
        let fields = [
            this._getLocalizableField('name', 'name'),
            this._getLocalizableField('email', 'email')
        ];

        return fields;
    }

    _getLocalizableField(localizationKey, value) {
        return this._getField(this.localizationManager.localize(localizationKey), value);
    }

    _getField(label, value) {
        return { label, value };
    }
};