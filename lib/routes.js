'use strict';

const Router = require('koa-router');
const router = new Router();

router.get('/', require('./api/discovery'));
router.get('/public/health', require('./api/health'));
router.post('/public/login', require('./api/login').login);
router.post('/public/register', require('./api/login').register);
router.get('/issues/:id', require('./api/issues').get);
router.post('/issues/:id', require('./api/issues').update);
router.post('/issues', require('./api/issues').post);
router.get('/issues', require('./api/issues').getAll);
router.get('/revisions/:id', require('./api/revisions').get);
router.post('/revisions/compare/:id', require('./api/revisions').compare);

module.exports = router;
