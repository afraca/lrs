'use strict';

const http = require('http');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const route = require('koa-route');
const compress = require('koa-compress');
const cors = require('./middlewares/cors');
const auth = require('./middlewares/auth');
const config = require('./config');
const constants = require('./constants');
const aboutRouteHandler = require('./routeHandlers/about');
const statementsRouteHandler = require('./routeHandlers/statements');
const resultsRouteHandler = require('./routeHandlers/results');
const insertRouteHandler = require('./routeHandlers/insert');
const accessTokensRouteHandler = require('./routeHandlers/accessTokens');

var app = new Koa();
app.use(compress());
app.use(cors);
app.use(logger());
app.use(bodyParser());

app.use(route.get('/xAPI/about', aboutRouteHandler));

app.use(async (ctx, next) => {
    const header = 'X-Experience-API-Version';
    if (ctx.get(header) && ctx.get(header).substring(0, 3) === config.xApiVersion.substring(0, 3)) {
        await next();
    } else {
        ctx.body = 'Invalid \'X-Experience-API-Version\' header was supplied';
        ctx.status = 400;
    }
    ctx.set(header, config.xApiVersion);
});

app.use(route.post('/accessTokens/revoke', accessTokensRouteHandler.revokeAllTokens));

app.use(route.post('/xAPI/statements', insertRouteHandler));

app.use(auth);

app.use(route.get('/xAPI/statements', statementsRouteHandler));
app.use(route.get('/xAPI/results', resultsRouteHandler));

app.use(route.get('/accessTokens', accessTokensRouteHandler.getTokens));
app.use(route.post('/accessTokens/:tokenId/revoke', accessTokensRouteHandler.revokeToken));
app.use(route.post('/accessTokens/:tokenId?/enable', accessTokensRouteHandler.enableToken));

const server = http.createServer(app.callback());
server.setTimeout(constants.socketLifetime);
server.listen(process.env.PORT || 3000, process.env.IP);