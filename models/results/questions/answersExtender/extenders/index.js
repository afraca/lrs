const constants = require('../../../../../constants');
const multipleSelect = require('./multipleSelect');
const rankingText = require('./rankingText');
const singleSelectText = require('./singleSelectText');
const statement = require('./statement');
const textMatching = require('./textMatching');

const extenders = {};

extenders[constants.questionTypes.multipleSelect] = multipleSelect;
extenders[constants.questionTypes.rankingText] = rankingText;
extenders[constants.questionTypes.singleSelectText] = singleSelectText;
extenders[constants.questionTypes.statement] = statement;
extenders[constants.questionTypes.textMatching] = textMatching;

module.exports = extenders;