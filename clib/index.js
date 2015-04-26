var io = require('./io');
var fileModel = require('./ng-file-model');
var fileUpload = require('./ng-file-upload');
var collectionFactory = require('./ng-collection-factory');
module.exports = function (config) {
	io();
	fileModel(angular);
	fileUpload(angular);
	collectionFactory(angular);
}