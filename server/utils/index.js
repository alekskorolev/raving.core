/*********************************************/
/*  Server utils library                     */
/*********************************************/
var logger = require('./logger'),
		emailer = require('./emailer'),
		cors = require('./cors'),
		uploader = require('./uploader'),
		config = require('./config'),
		helpers = require('../../utils/helpers');
module.exports = {
	Log: function (level) {
		return logger(level);
	},
	Cors: cors,
	Emailer: emailer,
	Uploader: uploader,
	DefOption: config,
	helpers: helpers
}