/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var user = require('./user-model'),
  access = require('./access-model');
module.exports = function (app) {
  "use strict";
  var log = app.get('logger')('raving.core/auth-access'),
    orm = app.get('orm'),
    helper = app.get('helpers');
  log.trace('Auth module init start');
  user(app);
  access(app);
};