'use strict';

var http = require('http');
var koa = require('koa');
var logger = require('koa-logger');
var route = require('koa-route');
var compress = require('koa-compress');
var cors = require('./middlewares/cors');
var constants = require('./constants');
var aboutRouteHandler = require('./routeHandlers/about');
var statementsRouteHandler = require('./routeHandlers/statements');
var resultsRouteHandler = require('./routeHandlers/results');
var insertRouteHandler = require('./routeHandlers/insert');

var VERSION = '1.0.2';

var app = koa();

app.use(compress());
app.use(cors);
app.use(logger());

app.use(route.get('/xAPI/about', aboutRouteHandler));

app.use(function*(next) {
    var header = 'X-Experience-API-Version';

    if (this.get(header) && this.get(header).substring(0, 3) === VERSION.substring(0, 3)) {
        yield next;
    } else {
        this.body = 'Invalid \'X-Experience-API-Version\' header was supplied';
        this.status = 400;
    }

    this.set(header, VERSION);
});

app.use(route.get('/xAPI/statements', statementsRouteHandler));
app.use(route.get('/xAPI/results', resultsRouteHandler));
app.use(route.post('/xAPI/statements', insertRouteHandler));

var server = http.createServer(app.callback());
server.setTimeout(constants.socketLifetime);
server.listen(process.env.PORT || 3000, process.env.IP);