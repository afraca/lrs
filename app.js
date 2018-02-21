'use strict';

const http = require('http');
const winston = require('winston');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');
const cors = require('./middlewares/cors');
const logging = require('./middlewares/logging');
const constants = require('./constants');
const router = require('./routes');

var app = new Koa();

const logger = new winston.Logger({
    transports: [new winston.transports.Console({ json: false, timestamp: true, level: 'warn' })]
});

app.use(compress());
app.use(cors);
app.use(logging(logger));
app.use(bodyParser());
app.use(router.routes());

const server = http.createServer(app.callback());
server.setTimeout(constants.socketLifetime);

server.listen(process.env.PORT || 3000, process.env.IP);
