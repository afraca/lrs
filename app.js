'use strict';

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const constants = require('./constants');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

let app = express();

app.use(morgan('combined'));
app.use(compression());
app.use(cors({
    allowedHeaders: constants.request.allowedHeaders
}));
app.use(bodyParser.json());
app.use(routes);
app.use(errorHandler);

let server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port ${server.address().port}`);
});

server.setTimeout(constants.socketLifetime);
