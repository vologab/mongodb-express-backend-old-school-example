'use strict';

var express = require('express');
var bodyParser = require('body-parser');

require('./utils/db');
var errorHandler = require('./error.middleware');

var app = express();
app.use(bodyParser.json());

require('./companies.routes')(app);

app.use(errorHandler);

module.exports = app;