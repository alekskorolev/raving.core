var models = require('../models');
module.exports = function (app) {
	var log = app.get('logger')('raving.core/auth-access');
	var orm = app.get('orm');
	var modelFactory = app.get('model-factory');
	var helper = app.get('helpers');
	var mail = app.get('emailer');
	var config = app.get('config');
	
	var navModel = modelFactory(models.navigats);
}