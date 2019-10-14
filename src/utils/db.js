
'use strict';

var mongoose = require('mongoose');

mongoose.connect(
  process.env.DB_URI + '/' + process.env.DB_NAME + process.env.DB_URI_OPTIONS,
  { useNewUrlParser: true }
);

module.exports = mongoose;