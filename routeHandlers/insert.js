'use strict';

var parse = require('co-body');
var db = require('../db');
var resultsUpdater = require('../helpers/resultsUpdater');

module.exports = function*(next) {
    var statement = yield parse(this);
    yield db.statements.insert(statement);
    if (statement.length) {
        for (var i = 0; i < statement.length; i++) {
            yield* resultsUpdater.update(statement[i]);
        }
    } else {
        yield* resultsUpdater.update(statement);
    }
    this.status = 200;
};