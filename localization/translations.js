const path = require('path');
const fileReader = require('../utils/fileReader');

class Translations {
    constructor() {
        this.translations = {};
    }

    getTranslation(key, culture) {
        if (!this.translations[culture]) {
            return key;
        }

        return this.translations[culture][key];
    }

    async loadTranslations(culture) {
        if (!this.translations.hasOwnProperty(culture)) {
            let translationsFilePath = path.join(__dirname, `lang/${culture}.json`);
            try {
                this.translations[culture] = JSON.parse(
                    await fileReader.readFile(translationsFilePath));
            } catch (error) {
                console.error('Cannot load translations for requested culture. ' +
                    `Culture: ${culture}. File path: ${translationsFilePath}.`);
                throw error;
            }
        }
    }
}

module.exports = new Translations();