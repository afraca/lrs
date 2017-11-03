'use strict';

const express = require('express');
const auth = require('../middlewares/auth');
const idTokenAuth = require('../middlewares/idTokenAuth');
const verifyXapiVersion = require('../middlewares/verifyXapiVersion');
const verifyAppApiKey = require('../middlewares/verifyAppApiKey');
const about = require('./handlers/about');
const statements = require('./handlers/statements');
const results = require('./handlers/results');
const entityStructure = require('./handlers/entityStructure');
const run = require('../errorHandling/asyncRunner');

var router = express.Router();
router.get('/xAPI/about', run(about));
router.post('/entity/structure', run(verifyAppApiKey), run(entityStructure.put));

router.use(run(verifyXapiVersion));
router.post('/xAPI/statements', run(statements.post));
router.post('/xAPI/results/archive/:attemptId', run(idTokenAuth), run(results.archive));
router.post('/xAPI/results/unarchive/:attemptId', run(idTokenAuth), run(results.unarchive));

router.use(run(auth));
router.get('/xAPI/statements', run(statements.get));
router.get('/xAPI/results', run(results.get));
router.get('/entity/structure', run(entityStructure.get));

module.exports = router;