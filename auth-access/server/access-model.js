var bcrypt = require('bcrypt');
var models = require('../models');
module.exports = function (app) {
	var log = app.get('logger')('raving.core/auth-access');
	var orm = app.get('orm');
	var modelFactory = app.get('model-factory');
	var helper = app.get('helpers');
	var mail = app.get('emailer');
	var config = app.get('config');
	models.access.extend = {
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
		}*/
	}
	var accessModel = modelFactory(models.access);
	
}