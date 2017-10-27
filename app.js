'use strict';

const http = require('http');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const compress = require('koa-compress');
const cors = require('./middlewares/cors');
const constants = require('./constants');
const routes = require('./routes');

var app = new Koa();
app.use(compress());
app.use(cors);
app.use(logger());
app.use(bodyParser());

routes.init(app);

const server = http.createServer(app.callback());
server.setTimeout(constants.socketLifetime);
server.listen(process.env.PORT || 3000, process.env.IP);