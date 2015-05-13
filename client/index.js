/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
window.$ = window.jQuery = require('jquery');
var clib = require('../clib'),
  snippets = require('../snippets'),
  auth = require('../auth-access/client');
require('jquery-ui');
require('angular');
require('angular-route');
module.exports = function (config) {
  "use strict";
  angular.module(config.core.appid, ['ngRoute', 'SocketIOModule', 'file-model', 'angularFileUpload', 'CollectionFactoryModule']);
  clib(config);
  snippets(config);
  auth(config);
/*

  require('./errorCtrl')(config);
  require('./headerCtrl')(config);
  require('./customScrollSnippet')(config); 
  require('./selectionSnippet')(config); 
  require('./menuSnippet')(config);
  require('./static')(config);
  require('../auth/client')(config);
  require('../articles/client')(config);
*/

  angular.module(config.core.appid)
    .constant('config', config)
    .config(function (config, socketIOProvider) {
      socketIOProvider.configure(config.core);
    })
    //TODO: расширить действия при старте приложения и при изменении навигации.
    .run(['$rootScope', 'socketIO', '$location', 'CollectionFactory', function ($rootScope, io, $location, CollectionFactory) {
      $rootScope.$on('$locationChangeStart', function (event) {
        var parse = /\/+(([^\/]+)(\/+([^\/]+))?)?.*/gi;
        $rootScope.root_class = $location.$$path.replace(parse, "$2 $4");
        $rootScope.root_class = $rootScope.root_class === " " ? "main-page" : $rootScope.root_class;
      });

    }]);

  /*require('./admin')(config);*/

};