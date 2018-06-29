const _ = require('lodash');

module.exports = class {
    constructor(spec, localizationManager) {
        if (!_.isObject(spec)) {
            throw 'You should provide spec for the result';
        }

        let actorHasHomePage = spec.actor.account && spec.actor.account.homePage;
        let actorHasAccountName = spec.actor.account && spec.actor.account.name;

        this.score = spec.score;
        this.status = spec.status;
        this.entityTitle = spec.entityTitle;
        this.actorName = spec.actor.name;
        this.actorEmail = '-';
        if (spec.actor.email && actorHasHomePage) {
            this.actorEmail = `${spec.actor.email} ${localizationManager.localize('from')} ${spec.actor.account.homePage}`;
        } else if (actorHasAccountName && actorHasHomePage) {
            this.actorEmail = `${spec.actor.account.name} ${localizationManager.localize('from')} ${spec.actor.account.homePage}`;
        } else if (spec.actor.email) {
            this.actorEmail = spec.actor.email;
        } else if (actorHasHomePage) {
            this.actorEmail =
            `${localizationManager.localize('from')} ${spec.actor.account.homePage}`;
        }
    }
};