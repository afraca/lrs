'use strict';

const http = require('http');
const winston = require('winston');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const compress = require('koa-compress');
const cors = require('./middlewares/cors');
const logging = require('./middlewares/logging');
const constants = require('./constants');
const config = require('./config');
const router = require('./routes');
const db = require('./db');

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            json: false,
            timestamp: true,
            level: config.log.level
        })
    ]
});

logger.verbose('Starting with configuration', config);

const app = new Koa();

app.use(compress());
app.use(cors);
app.use(logging(logger));
app.use(bodyParser());
app.use(router.routes());

const server = http.createServer(app.callback());
server.setTimeout(constants.socketLifetime);

db
    .connect(config.db.url, config.db.name, config.db.options)
    .then(() => server.listen(config.app.port, config.app.ip))
    .then(() => logger.verbose(`Listening on port ${config.app.port}`))
    .catch(e => {
        logger.error(e);
        process.exit(1);
    });

const shutdown = signal => {
    logger.verbose('Server is shutting down...');
    db.close();
    logger.verbose('Database connection closed...');
    server.close(e => {
        if (e) {
            logger.error(e);
            process.exit(1);
        }
        logger.warn(`Server stopped (${signal}).`);
        process.exit();
    });
};
process.on('SIGINT', () => {
    logger.verbose('Got SIGINT. Server shutdown started.');
    shutdown('SIGINT');
});

process.on('SIGTERM', () => {
    logger.verbose('Got SIGTERM. Server shutdown started.');
    shutdown('SIGTERM');
});
