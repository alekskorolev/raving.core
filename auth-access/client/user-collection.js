var models = require('../models');
module.exports = function (config) {
	angular.module(config.core.appid)
	.factory('userAuth', ['CollectionFactory', '$q', 'socketIO', function(CollFactory, $q, io) {
		var userAuth = new CollFactory(models.users);
		var user = userAuth.create({});
		user.auth = false;
		user.cancel = function () {
			return this.parse(this, true);
		}
		user.checkAuth = function () {
			var that = this;
			var deffered = $q.defer();
			if (user.auth) {
				deffered.resolve(that);
			} else {
				io.send('auth:check', {}, function(result) {
					if (result.success) {
						that.parse(result.user).then(function () {
							that.auth = true;
							deffered.resolve(that);
						}, function (err) {
							deffered.reject(err);
						});
					} else {
						deffered.reject(result.err || 'USER_NOT_AUTH');
					}
				});
			}
			return deffered.promise;	
		}
		user.Register = function () {
			var that = this;
			var deffered = $q.defer();
			var err = {};
			var haserr = false;
			if (!(this._.login && this._.login.length>6)) haserr = !!(err.login = 'LOGIN_MUST_HAVE');
			err._password = {};
			if (!(this._._password && this._._password.value && this._._password.value.length>6))
				haserr = !!(err._password.value = 'PASSWORD_MUST_HAVE');
			if (!(!haserr && this._._password.value == this._._password.revalue))
				haserr = !!(err._password.revalue = 'PASSWORD_CONFIRM_MISSMATCH');
			if (haserr) {
				deffered.reject(err);
			} else {
				this._._password.isNew = true;
				io.send('auth:register', this._, function(result) {
					if (result.err) {
						deffered.reject(result.err);
					} else {
						that.parse(result.user).then(function () {
							that.auth = true;
							deffered.resolve(that);
						}, function (err) {
							deffered.reject(err);
						});
					}
				})
			}
			return deffered.promise;	
		}
		user.Login = function () {
			var that = this;
			var deffered = $q.defer();
			var err = {};
			var haserr = false;
			if (!(this._.login && this._.login.length>6)) haserr = !!(err.login = 'LOGIN_MUST_HAVE');
			if (!(this._.password && this._.password.length>6))
				haserr = !!(err.password = 'PASSWORD_MUST_HAVE');
			if (haserr) {
				deffered.reject(err);
			} else {
				io.send('auth:login', this._, function(result) {
					if (result.err) {
						deffered.reject(result.err);
					} else {
						that.parse(result.user).then(function () {
							that.auth = true;
							deffered.resolve(that);
						}, function (err) {
							deffered.reject(err);
						});
					}
				})
			}
			return deffered.promise;
		}
		user.Logout = function () {
			var that = this;
			var deffered = $q.defer();
			io.send('auth:logout', {}, function(result) {
				that.auth = false;
				that.parse({}, true).then(function () {
					deffered.resolve(that);
				});
			});
			return deffered.promise;
		}
		user.Activate = function () {
			var that = this;
			var deffered = $q.defer();
			
			
			
			return deffered.promise;
		}
		user.Recovery = function () {
			var that = this;
			var deffered = $q.defer();
			
			
			
			return deffered.promise;
		}
		return user;
	}]);
}