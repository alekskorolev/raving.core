/* Check configs and defin undefined  */
/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $, describe, it */
var should = require('should');
module.exports = function (app) {
  "use strict";
  describe('Check config', function () {
    var config = app.get('config'),
      build = config.build,
      core = config.core;
    it('should by have property build is object', function () {
      config.should.have.property('build');
      config.build.should.be.a.Object;
    });
    it('build should have property dst is string', function () {
      build.should.have.property('dst');
      build.dst.should.be.a.String;
    });
    it('should by have property core is object', function () {
      config.should.have.property('core');
      config.core.should.be.a.Object;
    });
    it('core should have property protocol is string', function () {
      core.should.have.property('protocol');
      core.protocol.should.be.a.String;
    });
    it('core should have property host is string', function () {
      core.should.have.property('host');
      core.host.should.be.a.String;
    });
    it('core should have property port > 0', function () {
      core.should.have.property('port');
      core.port.should.be.above(0);
    });
    it('core should have property path is string', function () {
      core.should.have.property('path');
      core.path.should.be.a.String;
    });
    it('core should have property sessionkey is changed', function () {
      core.should.have.property('sessionkey');
      core.sessionkey.should.not.eql('need change');
    });
    it('core should have property db is object', function () {
      core.should.have.property('db');
      core.db.should.be.a.Object;
    });
    it('core.db should have property host is string', function () {
      core.db.should.have.property('host');
      core.db.host.should.be.a.String;
    });
    it('core.db should have property db is string', function () {
      core.db.should.have.property('db');
      core.db.db.should.be.a.String;
    });
    it('core should have property mode is string', function () {
      core.should.have.property('mode');
      core.mode.should.be.a.String;
    });
    it('core should have property appid is string', function () {
      core.should.have.property('appid');
      core.appid.should.be.a.String;
    });
    it('core should have property theme is string', function () {
      core.should.have.property('theme');
      core.theme.should.be.a.String;
    });
    it('core should have property assert is string', function () {
      core.should.have.property('assert');
      core.assert.should.be.a.String;
    });
    it('core should have property uploaddir is string', function () {
      core.should.have.property('uploaddir');
      core.uploaddir.should.be.a.String;
    });

  });
};