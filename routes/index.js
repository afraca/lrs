'use strict';

const route = require('koa-route');
const auth = require('../middlewares/auth');
const verifyXapiVersion = require('../middlewares/verifyXapiVersion');
const verifyAppApiKey = require('../middlewares/verifyAppApiKey');
const about = require('./handlers/about');
const statements = require('./handlers/statements');
const results = require('./handlers/results');
const entityStructure = require('./handlers/entityStructure');

module.exports = {
    init: app => {
        app.use(route.get('/xAPI/about', about));
        app.use(route.post('/entity/structure', verifyAppApiKey));
        app.use(route.post('/entity/structure', entityStructure.put));

        app.use(verifyXapiVersion);

        app.use(route.post('/xAPI/statements', statements.post));

        app.use(auth);

        app.use(route.get('/xAPI/statements', statements.get));
        app.use(route.get('/xAPI/results', results.get));
        app.use(route.post('/xAPI/results/archive/:attemptId', results.archive));
        app.use(route.post('/xAPI/results/unarchive/:attemptId', results.unarchive));
        app.use(route.get('/entity/structure', entityStructure.get));
    }
};