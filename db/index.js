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

module.exports = {
    statements,
    results
};