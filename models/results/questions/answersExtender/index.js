const _ = require('lodash');
const extenders = require('./extenders');

module.exports = function (spec, localizationManager) {
    if (_.isFunction(extenders[spec.questionType])) {
        extenders[spec.questionType].call(this, spec, localizationManager);
    }
};