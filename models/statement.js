const _ = require('lodash');
const constants = require('../constants');
const Actor = require('./actor');

module.exports = class {
    constructor(spec) {
        if (!_.isObject(spec)) {
            throw 'You should provide specification for reporting statement';
        }
        this.name = spec.object.definition.name['en-US'];
        this.date = new Date(spec.timestamp);
        this.actor = new Actor(spec.actor);

        if (spec.result && spec.result.score && _.isNumber(spec.result.score.scaled)) {
            this.score = Math.round(spec.result.score.scaled * 100);
        } else {
            this.score = null;
        }

        if (spec.result && spec.result.response) {
            this.response = spec.result.response;
        } else {
            this.response = null;
        }

        if (spec.object && spec.object.definition) {
            this.definition = spec.object.definition;
        }

        this.verb = spec.verb.id;

        this.id = spec.object.id;

        if (spec.context) {
            this.attemptId = spec.context.registration;
            if (spec.context.contextActivities && spec.context.contextActivities.parent) {
                this.parentId = spec.context.contextActivities.parent[0].id;
            }
            if (spec.context.extensions) {
                if (spec.context.extensions.hasOwnProperty(constants.extensions.survey)) {
                    this.isSurvey = spec.context.extensions[constants.extensions.survey];
                }
                if (spec.context.extensions.hasOwnProperty(constants.extensions.questionType)) {
                    this.questionType = spec.context.extensions[constants.extensions.questionType];
                }
            }
        }

        if (this.isSurvey) {
            this.score = null;
        }
    }
};