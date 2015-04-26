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
		}])
		.directive('customQuery', ['$rootScope', 'socketIO', '$location', 'CollectionFactory', function ($rootScope, io, $location, CollectionFactory) {
			return {
				restrict: 'EA',
				templateUrl: 'core/custom-query.html',
				replace: false,
				transclude: false,
				scope: {
				},
				controller: function ($scope, $element, $attrs, $transclude) {
					$scope.route = "";
					$scope.data = "{}";
					$scope.result = "";
					$scope.send = function () {
						var data = JSON.parse($scope.data);
						io.send($scope.route, data, function (result) {
							$scope.result = JSON.stringify(result);
							console.log(result);
						})
					}
				}
			}
		}]);
};