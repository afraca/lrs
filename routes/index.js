'use strict';

const router = require('koa-router')();
const auth = require('../middlewares/auth');
const idTokenAuth = require('../middlewares/idTokenAuth');
const verifyXapiVersion = require('../middlewares/verifyXapiVersion');
const verifyAppApiKey = require('../middlewares/verifyAppApiKey');
const about = require('./handlers/about');
const statements = require('./handlers/statements');
const results = require('./handlers/results');
const entityStructure = require('./handlers/entityStructure');

router.get('/xAPI/about', about);

router.post('/entity/structure', verifyAppApiKey, entityStructure.put);
router.get('/entity/structure', auth, entityStructure.get);

router.use(verifyXapiVersion);
router.post('/xAPI/statements', statements.post);
router.post('/statements', statements.post);

router.post('/xAPI/results/archive/:attemptId', idTokenAuth, results.archive);
router.post('/xAPI/results/unarchive/:attemptId', idTokenAuth, results.unarchive);

router.use(auth);
router.get('/xAPI/statements', statements.get);
router.get('/xAPI/results', results.get);

module.exports = router;
