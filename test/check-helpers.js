/* Check configs and defin undefined  */
/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $, describe, it */
var assert = require("assert"),
  should = require('should');
module.exports = function (app) {
  "use strict";
  describe('Check helpers', function () {
    var helpers = app.get('helpers');
    it('should be defined and object', function () {
      helpers.should.be.a.Object;
    });
    describe('propExist()', function () {
      var propExist = helpers.propExist;
      it('should return false if context is undefined', function () {
        assert.equal(false, propExist());
      });
      it('should return true if property is undefined', function () {
        assert.equal(true, propExist({prop: ""}));
      });
      it('should return false if property is not of string', function () {
        assert.equal(false, propExist({prop: ""}, 23));
      });
      it('should return true if property is exist', function () {
        assert.equal(true, propExist({test: {prop: "fdgh"}}, "test"));
      });
      it('should return true if property is exist recursive', function () {
        assert.equal(true, propExist({test: {prop: "fdgh"}}, "test.prop"));
      });
      it('should return true if property is not undefined but null', function () {
        assert.equal(true, propExist({test: {prop: "fdgh"}}, "test.prop"));
      });
    });
    describe('getProperty()', function () {
      var getProperty = helpers.getProperty,
        cntx = {test: {prop: "fdgh"}, 23: 1, tt: null};
      it('should return false if context is undefined', function () {
        assert.equal(false, getProperty());
      });
      it('should return true if property is undefined', function () {
        assert.equal(cntx, getProperty(cntx));
      });
      it('should return false if property is not of string', function () {
        assert.equal(false, getProperty(cntx, 23));
      });
      it('should return cntx.test if property is exist', function () {
        assert.equal(cntx.test, getProperty(cntx, "test"));
      });
      it('should return "fdgh" if property is exist recursive', function () {
        assert.equal("fdgh", getProperty(cntx, "test.prop"));
      });
      it('should return null if property is not undefined but null', function () {
        assert.equal(null, getProperty(cntx, "tt"));
      });
    });
    describe('hashKey()', function () {
      var hashKey = helpers.hashKey;
      it('should return string', function () {
        assert.equal("string", typeof (hashKey()));
      });
      it('should return string length 36 chars', function () {
        assert.equal(36, hashKey().length);
      });
      it('should return different code from 10000 calls', function (done) {
        var err,
          codes = [],
          i,
          code;
        for (i = 0; i < 10000; i += 1) {
          code = hashKey();
          if (codes.indexOf(code) > -1) {
            err = new Error('find dublicate');
          }
          codes.push(code);
        }
        done(err);
      });
    });
  });
};