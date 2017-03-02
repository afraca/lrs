'use strict';

var monk = require('monk');
var constants = require('../constants');

var dbhost = (process.env.DBHOST || process.env.IP || '127.0.0.1');
var dbname = (process.env.DBNAME || 'lrs');
var url = 'mongodb://' + dbhost + '/' + dbname;
var db = monk(url, { connectTimeoutMS: constants.dbConnectionTimeout, socketTimeoutMS: constants.dbSocketTimeout });
var statements = db.get('statements');
var results = db.get('results');

module.exports = {
    statements: statements,
    results: results
};
