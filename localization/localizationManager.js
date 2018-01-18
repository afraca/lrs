const _ = require('lodash');
const config = require('../config');
const translations = require('./translations');

const defaultCulture = 'en';
const supportedCultures = config.supportedLanguages;

module.exports = class LocalizationManager {
    constructor(userCultures) {
        this.culture = this._getCultureToLoad(userCultures);
    }

    static async create(userCultures) {
        var localizationManager = new LocalizationManager(userCultures);
        await localizationManager.initialize();
        return localizationManager;
    }

    async initialize() {
        await translations.loadTranslations(this.culture);
    }

    localize(key) {
        let item = translations.getTranslation(key, this.culture);

        if (_.isNil(item)) {
            throw new Error(`A resource with key "${key}" was not found`);
        }

        return item;
    }

    _getCultureToLoad(cultures) {
        let userCultures = cultures || [];

        for (let i = 0, userCulturesCount = userCultures.length; i < userCulturesCount; i++) {
            for (let j = 0, supportedCulturesCount = supportedCultures.length;
                    j < supportedCulturesCount; j++) {
                if (userCultures[i].toLowerCase() === supportedCultures[j].toLowerCase() ||
                    userCultures[i].toLowerCase().substring(0, 2) ===
                        supportedCultures[j].toLowerCase()) {
                    return supportedCultures[j];
                }
            }
        }
        return defaultCulture;
    }
};