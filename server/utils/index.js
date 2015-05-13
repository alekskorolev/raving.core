/*********************************************/
/*  Server utils library                     */
/*********************************************/
/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var logger = require('./logger'),
  emailer = require('./emailer'),
  cors = require('./cors'),
  uploader = require('./uploader'),
  config = require('./config'),
  helpers = require('../../utils/helpers');
module.exports = {
  Log: function (level) {
    "use strict";
    return logger(level);
  },
  Cors: cors,
  Emailer: emailer,
  Uploader: uploader,
  DefOption: config,
  helpers: helpers
};