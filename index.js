'use strict';
require('dotenv/config');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const jwt = require('koa-jwt');

const config = require('./config');
const router = require('./lib/routes');

const app = new Koa();

app.use(jwt({
    secret: config.secret
}).unless({
    path: [/^\/public/, '/']
})
);

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.port);
console.log('Listening on http://localhost:%s/', config.port);
