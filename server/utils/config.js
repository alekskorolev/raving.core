/* Check configs and defin undefined  */
/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
module.exports = function (config) {
  "use strict";

  config = config || {};
  config.build = config.build || {};
  config.build.dst = config.build.dst || 'www/';

  config.core = config.core || {};

  config.core.protocol = config.core.protocol || "http";
  config.core.host = config.core.host || 'localhost';
  config.core.port = config.core.port || '8080';
  config.core.path = config.core.path || '';
  config.core.sessionkey = config.core.sessionkey || 'need change';
  config.core.db = config.core.db || {};
  config.core.db.host = config.core.db.host || 'localhost';
  config.core.db.db = config.core.db.db || 'raving';
  config.core.mode = config.core.mode || 'dev';
  config.core.appid = config.core.appid || 'raving';
  config.core.theme = config.core.theme || 'default';
  config.core.assert = config.core.assert || config.build.dst;
  config.core.uploaddir = config.core.uploaddir || config.core.assert + 'upload';

  return config;
};