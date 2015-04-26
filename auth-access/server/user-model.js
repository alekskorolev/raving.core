var bcrypt = require('bcrypt');
var models = require('../models');
module.exports = function (app) {
	var log = app.get('logger')('raving.core/auth-access');
	var orm = app.get('orm');
	var modelFactory = app.get('model-factory');
	var helper = app.get('helpers');
	var mail = app.get('emailer');
	var config = app.get('config');

	models.users.extend = {
/*		save: function (req) {
			req.respond({success: false, err: 'METHOD_SAVE_NOT_ALLOWED', saved: null});
		},
		delete: function (req) {
			req.respond({success: false, err: 'METHOD_DELETE_NOT_ALLOWED', removed: null});
		},
		fetch: function (req) {
			req.respond({success: false, err: 'METHOD_FETCH_NOT_ALLOWED', collection: null});
		},
		getById: function (req) {
			req.respond({success: false, err: 'METHOD_GET_NOT_ALLOWED', collection: null});
		},*/
		register: function (req) {
			var regdata = this.clearBeforeSave(helper.getProperty(req, 'data'));
			var that = this;
			this.Model.create(regdata, function (err, user) {
				if (err || !user) return req.respond({success: !err, err: err?err.message: 'USER_REGISTRATION_ERROR', user: null});
				req.session.user = user;
				// TODO: calculate user access
				req.session.save();
				req.respond({success: true, err: null, user: {login: user.login, _id: user._id}});
			})
		},
		clearBeforeSave: function (data) {
			var clear = {
				login: data.login,
				_password: helper.getProperty(data, '_password.isNew')?{
					isNew: true, value: data._password.value, revalue: data._password.revalue
				}:undefined				
			}
			return clear;
		},
		login: function (req) {
			var data = helper.getProperty(req, 'data');
			var that = this;
			if (!(data.login && data.password)) return req.respond({
				success: false, err: 'LOGIN_AND_PASSWORD_MUST_HAVE', user: null});
			this.Model.findOne({login: data.login, __removed: false})
			.exec(function (err, user) {
				if (user && !err) {
					user.comparePassword(data.password, function (err, isMatch) {
						if (isMatch && !err) {
							req.session.user = user;
							that.getaccess(user.access, function (access) {
								log.debug(access);
							});
							// TODO: calculate user access
							req.session.save();
							req.respond({success: true, err: null, user: {login: user.login, _id: user._id}});
						} else {
							log.warn("Failure auth with login: ", data.login);	
							req.respond({success: false, err: 'AUTH_FAILURE', user: {}});
						}
					})
				} else {
					req.respond({success: false, err: 'USER_NOT_FOUND_OR_DATABASE_ERROR', user: null});
				}
			})
		},
		logout: function (req) {
			req.session.user = undefined;
			req.session.save();
			req.respond({success: true, err: null, user: {}});
		},
		getaccess: function (access, cb, calculate) {
			var accessModel = app.get('model:access');
			var that = this;
			var calculate = calculate || {ids: [], models: []};
			if (access && access instanceof Array && access.length>0) {
				accessModel.fetch({
					data: {
						filter: {
							_id: {$in: access}
						},
						nopaginate: true
					},
					respond: function (result) {
						var next = [];
						if (result.collection.length>0) {
							// add root object list in calculate array
							for (var key in result.collection) {
								var acc = result.collection[key];
								if (calculate.ids.indexOf(acc._id)<0) {
									calculate.models.push(acc);
									calculate.ids.push(acc._id);
								}
								if (acc.child && acc.child instanceof Array && acc.child.length>0) {
									// add child object list in calculate array
									for (var key in acc.child) {
										var _acc = acc.child[key];
										if (calculate.ids.indexOf(_acc._id)<0) {
											calculate.models.push(_acc);
											calculate.ids.push(_acc._id);
										}
										if (_acc.child && _acc.child instanceof Array && _acc.child.length>0) {
											// add child->child ids in next iteration
											for (var key in _acc.child) {
												var id = _acc.child[key]._id;
												if (next.indexOf(id)<0) next.push(id);
											}
										}
									}
								}
							}
							that.getaccess(next, cb, calculate); 
						} else {
							cb(calculate);
						}
					}
				})
			} else {
				cb(null);
			}
		},
		checkauth: function (req) {
			var user = helper.getProperty(req, 'session.user')
			req.respond({success: !!user, err: !user?'USER_NOT_AUTH':null , user: {login: user.login, _id: user._id}});
		},
		activate: function (req) {
		},
		recovery: function (req) {
		}
	}
	
	models.users.schemaMethods = {
		comparePassword: function(candidatePassword, cb) {
			bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
				if (err || !isMatch) {
					cb('WRONG_PASSWORD', isMatch);
				} else {
					cb(null, isMatch);
				}

			});
		}
	}
		
	var userModel = modelFactory(models.users);
	
	userModel.Schema.pre('save', function (next) {
		var pass = this._password&&this._password.isNew?this._password:false;
		var that = this;
		if (pass) {
			if (!(pass.value&&pass.value.length)) return next(new Error('PASSWORD_AT_LEAST_6_CHARS'));
			if (pass.value!=pass.revalue) return next(new Error('CONFIRM_PASSWORD_INCORRECT'));
			var salt = bcrypt.genSaltSync(10);
			bcrypt.hash(pass.value, salt, function (err, hash) {
				if (err) return next(err);
				that.password  = hash;
				that._password = undefined;
				next();
			});
		} else if (this.isNew) {
			next(new Error('INCORRECT_PASSWORD_CANDIDATE'));
		} else {
			next();
		}
	});
	
	userModel.Schema.pre('save', function (next) {
		var that = this;
		if (this.isNew) {
			var err;
			if (!this.login) err = new Error('INCORRECT_LOGIN');
			if (err) return next(err);
			userModel.Model.findOne({login: this.login, __removed: false})
			.exec(function(err, user) {
				err = err || user?(new Error('USER_ALREADY_EXIST')):null;
				if (err) return next(err);
				var d = new Date().getTime();
				that.activate = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					var r = (d + Math.random()*16)%16 | 0;
					d = Math.floor(d/16);
					return (c=='x' ? r : (r&0x7|0x8)).toString(16);
				});
				var url = config.core.protocol + "://" +
						config.core.host + (config.core.port?":"+config.core.port:"") +
						"/" + config.core.path + "!#/auth/activate/" + that.activate;				
				mail({
					email: that.login,
					name: that.login,
					text: "Your register complite, please, activate your email: " + url ,
					subject: "Registration comfirmation"
				});
				next();
			})
		} else {
			next();
		}
	});
	app.io.route('auth:register', function (req) { userModel.register(req) });
	app.io.route('auth:login', function (req) { userModel.login(req) });
	app.io.route('auth:logout', function (req) { userModel.logout(req) });
	app.io.route('auth:activate', function (req) { userModel.activate(req) });
	app.io.route('auth:recovery', function (req) { userModel.recovery(req) });
	app.io.route('auth:check', function (req) { userModel.checkauth(req) });
}