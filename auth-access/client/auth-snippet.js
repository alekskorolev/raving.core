module.exports = function (config) {
	angular.module(config.core.appid)
	.directive('authSnippet', ['userAuth', '$rootScope', '$q', '$timeout', function (user, $rootScope, $q, $timeout) {
			return {
				restrict: 'EA',
				templateUrl: 'core/auth/snippet.html',
				replace: false,
				transclude: false,
				scope: {
					snLoginPopup: "@",
					snClosePopups: "@",
					snRegisterPopup: "@",
					snRecoveryPopup: "@"
				},
				controller: function ($scope, $element, $attrs, $transclude) {
					$scope.user = user;
					$scope.errors = {
						login: {},
						register: {}
					}
					$scope.openLoginPopup = function () {
						$rootScope.$broadcast($scope.snLoginPopup);
					}
					$scope.close = function () {
						user.cancel();
						$rootScope.$broadcast($scope.snClosePopups);
					}
					$scope.openRegisterPopup = function () {
						$rootScope.$broadcast($scope.snRegisterPopup);
					}
					$scope.openRecoveryPopup = function () {
						$rootScope.$broadcast($scope.snRecoveryPopup);
					}
					$scope.login = function () {
						console.log(user);
						user.Login().then(function(user) {
							$rootScope.$broadcast($scope.snClosePopups);
						}, function(err) {
							console.log(err);
							$scope.errors.login = err;
							$timeout(function () {
								$scope.errors.login = {};
							},1500);
							//TODO: render errors
						})
					}
					$scope.register = function () {
						console.log(user);
						user.Register().then(function(user) {
							$rootScope.$broadcast($scope.snClosePopups);
						}, function(err) {
							console.log(err);
							$scope.errors.register = err;
							$timeout(function () {
								$scope.errors.register = {};
							},1500);
							//TODO: render errors
						})
					}
					$scope.logout = function () {
						user.Logout();
					}
					$element.find('input').on('keydown', function (event) {
						if (event.keyCode==13) {
							$(event.currentTarget)
								.parents('.modal-body')
								.find('button.btn-success')
								.trigger('click');
						}
					});
				}
			}
		}]);
};
