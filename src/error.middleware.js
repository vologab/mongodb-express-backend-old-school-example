'use strict';
var logger = require('./utils/logger');

function errorHandler(err, req, res, next) {
  if (err.message && err.status) {
    res.status(err.status).json({ message: err.message });
    logger.info(err.message);
  } else {
    res.status(500).json({ message: 'Something went wrong' });
    logger.warn('Unexpected error', err);
  }
  next(err);
}

module.exports = errorHandler;