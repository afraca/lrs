'use strict';

const route = require('koa-route');
const auth = require('../middlewares/auth');
const verifyXapiVersion = require('../middlewares/verifyXapiVersion');
const verifyAppApiKey = require('../middlewares/verifyAppApiKey');
const about = require('./handlers/about');
const statements = require('./handlers/statements');
const results = require('./handlers/results');
const insert = require('./handlers/insert');
const entityStructure = require('./handlers/entityStructure');

module.exports = {
    init: app => {
        app.use(route.post('/entity/structure', verifyAppApiKey));
        app.use(route.post('/entity/structure', entityStructure.post));
        app.use(route.get('/xAPI/about', about));

        app.use(verifyXapiVersion);

        app.use(route.post('/xAPI/statements', insert));

        app.use(auth);

        app.use(route.get('/xAPI/statements', statements));
        app.use(route.get('/xAPI/results', results));
        app.use(route.get('/entity/structure', entityStructure.get));
    }
};