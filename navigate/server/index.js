/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var models = require('../models');
module.exports = function (app) {
  "use strict";
  var log = app.get('logger')('raving.core/auth-access'),
    orm = app.get('orm'),
    modelFactory = app.get('model-factory'),
    helper = app.get('helpers'),
    mail = app.get('emailer'),
    config = app.get('config'),
    navModel = modelFactory(models.navigats);
};