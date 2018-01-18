const _ = require('lodash');

module.exports = class {
    constructor(spec, localizationManager) {
        if (!_.isObject(spec)) {
            throw 'You should provide spec for the result';
        }

        this.score = spec.score;
        this.status = spec.status;
        this.entityTitle = spec.entityTitle;
        this.actorName = spec.actor.name;
        this.actorEmail = '-';
        if (spec.actor.email) {
            this.actorEmail = spec.actor.email;
        } else if (spec.actor.account && spec.actor.account.homePage) {
            this.actorEmail =
            `${localizationManager.localize('from')} ${spec.actor.account.homePage}`;
        }
    }
};