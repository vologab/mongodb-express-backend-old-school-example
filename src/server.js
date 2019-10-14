'use strict';

var http = require('http');

var app = require('./app');
var logger = require('./utils/logger');

function bootstrap() {

  var PORT = Number(process.env.PORT || 3000);
  app.set('port', PORT);

  var server = http.createServer(app);

  server.listen(PORT, function appStart() {
    logger.info('Application started on PORT: ' + PORT);
  });
}

bootstrap();