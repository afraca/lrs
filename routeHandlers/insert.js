'use strict';

const db = require('../db');
const resultsUpdater = require('../helpers/resultsUpdater');

module.exports = async ctx => {
    var statement = ctx.request.body;
    await db.statements.insert(statement);
    if (statement.length) {
        for (let i = 0; i < statement.length; i++) {
            await resultsUpdater.update(statement[i]);
        }
    } else {
        await resultsUpdater.update(statement);
    }
    ctx.status = 200;
};