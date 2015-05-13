/*********************************************/
/*  File uploader                            */
/*  TODO: must be updated on the tasks       */
/*********************************************/
/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
module.exports = function (app) {
  "use strict";
  var log = app.get('logger')('raving.core/model-factory'),
    upload = function (req, res) {
      log.debug(req.files);
      var path = req.files.file.path.split('/'),
        file = {
          file: path[path.length - 1],
          type: req.files.file.type,
          size: req.files.file.size,
          original: req.files.file.originalFilename
        };
      res.send(file);
    };
  app.post('/upload', upload);
};