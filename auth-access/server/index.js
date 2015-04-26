
var user = require('./user-model');
var access = require('./access-model');
module.exports = function (app) {
	var log = app.get('logger')('raving.core/auth-access');
	var orm = app.get('orm');
	log.trace('Auth module init start');
	var helper = app.get('helpers');
	user(app);
	access(app);
}