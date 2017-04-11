'use strict';

const monk = require('monk');
const constants = require('../constants');

const dbhost = (process.env.DBHOST || process.env.IP || '127.0.0.1');
const dbname = (process.env.DBNAME || 'lrs');
const url = `mongodb://${dbhost}/${dbname}`;
const db = monk(url, {
    connectTimeoutMS: constants.dbConnectionTimeout, socketTimeoutMS: constants.dbSocketTimeout
});
var statements = db.get('statements');
var results = db.get('results');

const tokensDbHost = (process.env.TOKENS_DBHOST || process.env.IP || '127.0.0.1');
const tokensDbName = (process.env.TOKENS_DBNAME || 'tokens');
const tokensUrl = `mongodb://${tokensDbHost}/${tokensDbName}`;
var tokensDb = monk(tokensUrl);
var tokens = tokensDb.get('accessTokens');

module.exports = {
    statements,
    results,
    tokens
};