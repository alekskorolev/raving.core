/*********************************************/
/*  File uploader                            */
/*  TODO: must be updated on the tasks       */
/*********************************************/
module.exports = function (app) {
	var upload = function (req, res) {
		log.debug(req.files);
		var path = req.files.file.path.split('/')
		var file = {
			file: path[path.length-1],
			type: req.files.file.type,
			size: req.files.file.size,
			original: req.files.file.originalFilename
		}
		res.send(file);
	};
	app.post('/upload', upload);
}