$ = jQuery = require('jquery'),
		clib = require('../clib'),
		snippets = require('../snippets'),
		auth = require('../auth-access/client');
require('jquery-ui');
require('angular');
require('angular-route');
module.exports = function (config) {
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
		.config(function(config, socketIOProvider) {
			socketIOProvider.configure(config.core);
		})
		//TODO: расширить действия при старте приложения и при изменении навигации.
		.run(['$rootScope', 'socketIO', '$location', 'CollectionFactory', function ($rootScope, io, $location, CollectionFactory) {
			$rootScope.$on('$locationChangeStart', function(event) {
				var parse = /\/+(([^\/]+)(\/+([^\/]+))?)?.*/gi
				$rootScope.root_class=$location.$$path.replace(parse,"$2 $4")
				$rootScope.root_class = $rootScope.root_class==" "?"main-page":$rootScope.root_class;
			});
			
			
			// TODO: remove next lines
/*			var testCollection = new CollectionFactory({
				name: "users",
				pattern: {login: {type: "String"}},
				cExtend: {
					save: function() {console.log('ext save c')}, 
					nav: function() {console.log('ext nav c')}
				},
				mExtend: {
					save: function() {console.log('ext save m')}, 
					login: function() {console.log('ext login m')}, 
				}
			});
			
			var ttCollection = new CollectionFactory({pattern: {login: {type: "String"}}});
			var testModel = testCollection.create({_id:'5531f79ed09da52e1ae7b7df'});
			var ttModel = ttCollection.create({d:'sssd'});
			// for auth-snippet

			
			console.log(testCollection, testModel, ttCollection, ttModel);*/
/*			io.send('auth:register', {login: "mailtest3@serpteam.ru", _password: {isNew: true, value: "edcrfvtgb", revalue: "edcrfvtgb"}}, function(result) {
				console.log(result);
			});*/
			//io.send('auth:logout', {}, function (result) { console.log(result) });
			//io.send('auth:login', {login: "mailtest3@serpteam.ru", password:"edcrfvtgb"}, function (result) { console.log(result) }); 
		}]);
	
	/*require('./admin')(config);*/

};