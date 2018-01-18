const moment = require('moment');
const resultStatus = require('../../models/results/resultStatus');

const DateFormatString = 'YYYY-MM-DD HH:mm:ss';

module.exports = class DataMapper {
    constructor(localizationManager) {
        this.localizationManager = localizationManager;
    }

    map(result) {
        return {
            name: result.actorName,
            email: result.actorEmail,
            result: this._getStatusString(result.status),
            score: result.score
        };
    }

    _getDate(date, defaultValue) {
        if (!date) {
            return defaultValue;
        }

        return moment(date).format(DateFormatString);
    }

    _getStatusString(status) {
        switch (status) {
        case resultStatus.passed:
            return this.localizationManager.localize('passed');
        case resultStatus.failed:
            return this.localizationManager.localize('failed');
        default:
            return this.localizationManager.localize('inProgress');
        }
    }
};