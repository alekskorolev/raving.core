/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $, describe, it */
var assert = require("assert"),
  should = require('should');
module.exports = function (app) {
  "use strict";
  describe('Factory test', function () {
    var Factory = app.get('model-factory');
    it('should be Function', function () {
      Factory.should.be.a.Function;
    });
    describe('created model', function () {
      var pattern = {
        name: 'testpattern',
        pattern: {
          title: {
            type: "String"
          },
          text: {
            type: "String"
          },
        },
        populate: 'access',
        access: {
          collection_create: false,
          collection_read: false,
          collection_update: false,
          collection_delete: false
        }
      },
        model = new Factory(pattern);
      it('should be object', function () {
        model.should.be.a.Object;
      });
      it('app should be setted model', function () {
        var setted = app.get('model:testpattern');
        setted.should.be.a.Object;
      });
      it('should by have property ioRoute is function', function () {
        model.should.have.property('ioRoute');
        model.ioRoute.should.be.Function;
      });
      it('should by have property Model is function', function () {
        model.should.have.property('Model');
        model.Model.should.be.Function;       
      });
      it('should by have property Class is object', function () {
        model.should.have.property('Class');
        model.Class.should.be.Object;       
      });
      it('should by have property Schema is object', function () {
        model.should.have.property('Schema');
        model.Schema.should.be.Object;       
      });
      it('should by have property config is object', function () {
        model.should.have.property('config');
        model.config.should.be.Object;       
      });
    });
  });
};