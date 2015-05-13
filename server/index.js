/*********************************************/
/*  Main server script                       */
/*  Make http/https/web-socket servers       */
/*  connect to extended modules of core      */
/*********************************************/

/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var express = require('express'),
  http = require('http'),
  socket = require('socket.io'),
  session = require('express-session'),
  Deferred = require('promised-io/promise').Deferred,
  bodyParser = require('body-parser'),
  RedisStore = require('connect-redis')(session),
  mongoose = require('mongoose'),
  mrCache = require('mongoose-redis-cache'),
  utils = require('./utils'),
  multipart = require('connect-multiparty'),
  socketSession = require('./socket-session'),
  modelFactory = require('./model-factory'),
  authAccess = require('../auth-access/server'),
  navigate = require('../navigate/server');
require('mongoose-pagination');
require('mongoose-regexp')(mongoose);


module.exports = function (options) {
  "use strict";

  // set default values on undefined options
  options = utils.DefOption(options);

  // set loglevel and get logger
  var Log = utils.Log((options.mode === 'prod') ? 'ERROR' : 'TRACE'),
    log = new Log('raving.core/index.js'),

  // create express application
    app = express(),

  // create http/https server and connect application
  // TODO: add to creation https interface
    server = http.Server(app),

  //create socket.io server
    io = socket(server),
    session_storage = new RedisStore(),
    initSession;
  // add services in application
  app.set('orm', mongoose);
  app.set('config', options);
  app.set('logger', Log);
  app.set('emailer', utils.Emailer(app));
  app.set('deffered', Deferred);
  app.set('helpers', utils.helpers);

  app.use(utils.Cors);
  app.use(session({
    secret: options.core.sessionkey,
    resave: false,
    saveUninitialized: true,
    store: session_storage
  }));

  // enable multipart forms
  app.use(multipart({
    uploadDir: options.core.uploaddir
  }));

  // enable static dir for development mode
  if (options.mode === 'dev') {
    app.use(express.static(options.core.assert));
  }

  //set body parcing
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());

  //enable express session from socket.io
  app.io = io;
  socketSession(io, session_storage);

  // enable uploader
  // TODO: create uploader module
  utils.Uploader(app);


  // connect on database
  mongoose.connect("mongodb://" + options.core.db.host + '/' + options.core.db.db);
  mrCache(mongoose);

  modelFactory(app);


  initSession = function (req, res) {
    log.debug('Set session: ', req.session);
    req.session.updated = new Date().toString();
    req.session.save();
    if (req.session.user) {
      res.send({
        session: 'updated',
        user: req.session.user
      });
    } else {
      res.send({
        session: 'updated'
      });
    }
  };
  app.post('/auth/session', initSession);
  authAccess(app);
  navigate(app);

  app.stop = function () {
    log.debug('stop application instance');
    server.close();
    session_storage.client.end();
    mongoose.disconnect();
    mongoose.redisClient.end();
  };

  server.listen(options.core.port);

  return app;
};