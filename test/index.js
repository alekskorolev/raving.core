/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $, describe, it, after */
var hasPropertys = require('./has-property'),
  checkConfig = require('./check-config'),
  checkHelper = require('./check-helpers'),
  factoryTest = require('./factory-test'),
  assert = require("assert");
module.exports = function (app) {
  "use strict";
  describe('Test raving.core', function () {
    hasPropertys(app);
    checkConfig(app);
    checkHelper(app);
    factoryTest(app);
  });
};