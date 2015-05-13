/*********************************************/
/*  Extended logger                          */
/*********************************************/
/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var log4js = require('log4js');

module.exports = function (level) {
  "use strict";
  return function (name) {
    var log = log4js.getLogger(name);
    log.setLevel(level);
    return log;
  };
};

