const _ = require('lodash');
const constants = require('../constants');

module.exports = class {
    constructor(spec) {
        if (!_.isObject(spec)) {
            throw 'You should provide specification for the actor';
        }
        this.name = spec.name;
        if (spec.mbox) {
            this.email = spec.mbox.replace('mailto:', '');
        }
        if (spec.account) {
            this.account = spec.account;

            if (constants.emailRegex.test(spec.account.name)) {
                this.email = spec.account.name;
            }
        }
    }
};