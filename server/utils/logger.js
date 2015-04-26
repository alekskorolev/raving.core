/*********************************************/
/*  Extended logger                          */
/*********************************************/
var log4js = require('log4js');

module.exports = function (level) {
	return function (name) {
		log = log4js.getLogger(name);
		log.setLevel(level);
		return log;
	}
}

