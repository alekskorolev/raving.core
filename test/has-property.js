/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $, describe, it, after */
module.exports = function (app) {
  "use strict";
  describe('Check app propeties & methods', function () {
    it('app should has "set"', function (done) {
      done(app.hasOwnProperty('set') ? null : new Error('has not "set"'));
    });
    it('app should has "get"', function (done) {
      done(app.hasOwnProperty('get') ? null : new Error('has not "get"'));
    });
    it('app should has "post"', function (done) {
      done(app.hasOwnProperty('post') ? null : new Error('has not "post"'));
    });
    it('app should has "stop"', function (done) {
      done(app.hasOwnProperty('stop') ? null : new Error('has not "stop"'));
    });
    it('app should has "io"', function (done) {
      done(app.hasOwnProperty('io') ? null : new Error('has not "io"'));
    });
  });
};