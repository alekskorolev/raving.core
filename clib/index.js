/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var io = require('./io'),
  fileModel = require('./ng-file-model'),
  fileUpload = require('./ng-file-upload'),
  collectionFactory = require('./ng-collection-factory');
module.exports = function (config) {
  "use strict";
  io();
  fileModel(angular);
  fileUpload(angular);
  collectionFactory(angular);
};