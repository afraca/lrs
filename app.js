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
const db = require('./db');

const logger = new winston.Logger({
    transports: [new winston.transports.Console({ json: false, timestamp: true, level: 'warn' })]
});

var app = new Koa();

app.use(compress());
app.use(cors);
app.use(logging(logger));
app.use(bodyParser());
app.use(router.routes());

const server = http.createServer(app.callback());
server.setTimeout(constants.socketLifetime);

const dbhost = process.env.DBHOST || process.env.IP || '127.0.0.1';
const dbname = process.env.DBNAME || 'lrs';
const connectionString = `mongodb://${dbhost}`;

db
    .connect(connectionString, dbname)
    .then(() => server.listen(process.env.PORT || 3000, process.env.IP))
    .catch(e => {
        logger.error(e);
        process.exit(1);
    });
