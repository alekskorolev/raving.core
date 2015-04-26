var user = require('./user-collection');
var snippet = require('./auth-snippet');
module.exports = function (config) {
	user(config);
	snippet(config);
	angular.module(config.core.appid)
	.run(['$rootScope', 'socketIO', '$location', 'CollectionFactory', 'userAuth', function ($rootScope, io, $location, CollectionFactory, user) {
		user.checkAuth().then(function(user) {
			console.log(user);
		}, function (err) {
			console.log(err);
		})
	}]);
}