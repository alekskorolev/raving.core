/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var bcrypt = require('bcrypt'),
  models = require('../models');
module.exports = function (app) {
  "use strict";
  var log = app.get('logger')('raving.core/auth-access'),
    orm = app.get('orm'),
    modelFactory = app.get('model-factory'),
    helper = app.get('helpers'),
    mail = app.get('emailer'),
    config = app.get('config'),
    accessModel;
  models.access.extend = {
/*    save: function (req) {
      req.respond({
        success: false,
        err: 'METHOD_SAVE_NOT_ALLOWED',
        saved: null
      });
    },
    delete: function (req) {
      req.respond({
        success: false,
        err: 'METHOD_DELETE_NOT_ALLOWED',
        removed: null
      });
    },
    fetch: function (req) {
      req.respond({
        success: false,
        err: 'METHOD_FETCH_NOT_ALLOWED',
        collection: null
      });
    },
    getById: function (req) {
      req.respond({
        success: false,
        err: 'METHOD_GET_NOT_ALLOWED',
        collection: null
      });
    }*/
  };
  accessModel = modelFactory(models.access);
};