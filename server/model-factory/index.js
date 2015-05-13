/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var bcrypt = require('bcrypt'),
  proto = require('./model-proto'),
  Parsepattern = require('./pattern-parser');
module.exports = function (app) {
  "use strict";
  var log = app.get('logger')('raving.core/model-factory'),
    config = app.get('config'),
    orm = app.get('orm'),
    mail = app.get('emailer'),
    modelFactory,

    checkAccess = {
      fetch: function (session, collection) {

      }
    },

  // define prototype methods
    $proto = proto(app),

  // include pattern parser
    parsepattern = new Parsepattern(app),

  // Model Class
    Model = function (options) {
      var log = app.get('logger')('raving.core/model-factory/' + options.name),
        that = this,
        pattern,
        key;
      // check correct options
      if (!options) {
        throw new Error("Options must be!");
      } else if (!options.name) {
        throw new Error("Options.name must be!");
      } else if (!(options.pattern instanceof Object && !(options.pattern instanceof Array))) {
        throw new Error("Options.pattern must be Object {}!");
      }

      // prepare pattern from use
      pattern = parsepattern(options.pattern);
      log.debug(pattern);

      // defain default access rules
      options.access = options.access || {};

      options.access.collection_create =
        options.access.collection_create === undefined ?
            true : options.access.collection_create;
      options.access.collection_read =
        options.access.collection_read === undefined ?
            true : options.access.collection_read;
      options.access.collection_update =
        options.access.collection_update === undefined ?
            true : options.access.collection_update;
      options.access.collection_delete =
        options.access.collection_delete === undefined ?
            true : options.access.collection_delete;

      //define service fields
      pattern.__creator = {
        type: orm.Schema.Types.ObjectId,
        ref: 'users'
      };
      pattern.__updater = {
        type: orm.Schema.Types.ObjectId,
        ref: 'users'
      };
      pattern.__deleter = {
        type: orm.Schema.Types.ObjectId,
        ref: 'users'
      };
      pattern.__created = {
        type: Date,
        default: Date.now
      };
      pattern.__updated = {
        type: Date,
        default: Date.now
      };
      pattern.__deleted = {
        type: Date
      };
      pattern.__removed = {
        type: Boolean,
        default: false
      };
      pattern.__readonly = {
        type: Boolean,
        default: null
      };

      // extend methods and attributes
      if (options.extend instanceof Object && !(options.extend instanceof Array)) {
        for (key in options.extend) {
          if (options.extend.hasOwnProperty(key)) {
            this[key] = options.extend[key];
          }
        }
      } else {
        log.debug('Extend option must be Object {}');
      }

      // set prototype and model name
      /*this.__proto__ = $proto;*/
      this.config = options;

      // create mongoose chema;
      this.Schema = new orm.Schema(pattern);

      // setter service fields
      this.Schema.virtual('_option')
        .set(function (opt) {
          opt = opt || {};
          // set remove or update time and clear undeleted flag if is remove
          if (opt.remove) {
            this.__deleted = Date.now();
            this.__removed = true;
          } else {
            this.__updated = Date.now();
          }
          if (opt.readonly === false || opt.readonly === true) {
            this.__readonly = opt.readonly;
          }

          // set user info, who update or remove or create document
          if (opt.user && opt.user._id) {
            // has a session
            if (this.isNew) {
              this.__creator = opt.user._id;
            }
            if (opt.remove) {
              this.__deleter = opt.user._id;
            } else {
              this.__updater = opt.user._id;
            }
          }
        });


      if (options.schemaMethods instanceof Object && !(options.schemaMethods instanceof Array)) {
        for (key in options.schemaMethods) {
          if (options.schemaMethods.hasOwnProperty(key)) {
            this.Schema.methods[key] = options.schemaMethods[key];
          }
        }
      } else {
        log.debug('Methods must be Object {}');
      }

      /*		// check access of create, update or remove model
              this.Schema.pre('save', function (next) {
                  if (this.isNew) {
                      log.debug(this._session);
                      next();
                  } else if (this.__removed) {
                      // check access of remove
                  } else {
                      // check access of update
                  }
              });*/

      this.Model = orm.model(this.config.name, this.Schema);

      this.Class = $proto;

      this.ioRoute = function (route, cb) {
        app.io.route('models:' + options.name + ':' + route, function (req) {
          cb.call(that, req);
        });
      };

      // routes from single model
      this.ioRoute('get', this.getById);
      this.ioRoute('save', this.save);
      this.ioRoute('delete', this.delete);
      this.ioRoute('fetch', this.fetch);

    };
  Model.prototype = $proto;

  modelFactory = function (options, extend) {
    var model = new Model(options, extend);
    if (model) {
      app.set('model:' + options.name, model);
    }
    return model;
  };


  // include model factory in app
  app.set('model-factory', modelFactory);
};