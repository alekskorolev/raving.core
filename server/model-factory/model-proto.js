/*********************************************************/
/* Prototype of Model for factory labrary                */
/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
module.exports = function (app) {
  "use strict";
  var log = app.get('logger')('raving.core/model-factory'),
    config = app.get('config'),
    orm = app.get('orm'),
    mail = app.get('emailer'),
    helper = app.get('helpers');

  return {
    /// update existing model or create new
    /// @param {Object} Raving request object or emulate,
    /// should have respond method for recieve the result
    /// recieved errors:
    /// SAVED_DOCUMENT_NOT_FOUND - if document has _id but not found
    /// DOCUMENT_SAVE_ERROR - if save error existing document
    /// SAVE_NOT_ALLOWED - if user have not update priveleges
    /// DOCUMENT_CREATE_ERROR - if save error new document
    /// CREATE_NOT_ALLOWED - if user have not create priveleges
    save: function (req) {
      var user = helper.getProperty(req, 'session.user') || {},
        _model = helper.getProperty(req, 'data'),
        access,
        that,
        query,
        model;
      // TODO: send error MODEL_DATA_EMPTY
      if (!_model) {
        return req.respond({
          success: false,
          err: "MODEL_DATA_EMPTY",
          saved: null
        });
      }
      access = this.getUserAccess(user);

      _model._option = {
        user: helper.getProperty(req, 'session.user') || {},
        readonly: _model._readonly
      };
      that = this;
      if (_model._id) {
        // it`s update
        query = this.Model.findById(req.data._id);

        query.exec(function (err, model) {
          log.debug(model, user, access.collection_update, access.custom_update);
          if (err || !model || model.__removed) {
            req.respond({
              success: false,
              err: "SAVED_DOCUMENT_NOT_FOUND",
              saved: null
            });
          } else if (that.checkCanDo(model, user,
              access.collection_update, access.custom_update)) {
            that.setNewValues(model, _model);
            model.save(function (err, saved) {
              err = err || !saved ? "DOCUMENT_SAVE_ERROR" : null;
              req.respond({
                success: !err,
                err: err,
                saved: saved
              });
            });
          } else {
            req.respond({
              success: false,
              err: "SAVE_NOT_ALLOWED",
              saved: null
            });
          }
        });
      } else {
        // it`s create
        if (access.collection_create) {
          model = {};
          that.setNewValues(model, _model);
          log.debug(model);
          this.Model.create(model).then(function (data) {
            var err = !data ? "DOCUMENT_CREATE_ERROR" : undefined;
            req.respond({
              success: !err,
              err: err,
              saved: data
            });
          });
        } else {
          req.respond({
            success: false,
            err: "CREATE_NOT_ALLOWED",
            saved: null
          });
        }
      }
    },
    delete: function (req) {
      log.debug('this start proto delete', this.config);
      var user = helper.getProperty(req, 'session.user') || {},
        _model = helper.getProperty(req, 'data'),
        access,
        that,
        query;
      if (!_model) {
        return req.respond({
          success: false,
          err: "MODEL_DATA_EMPTY",
          removed: null
        });
      }
      access = this.getUserAccess(user);
      that = this;
      if (_model._id) {
        query = this.Model.findById(_model._id);
        query.exec(function (err, model) {
          if (err || !model || model.__removed) {
            req.respond({
              success: false,
              err: "DOCUMENT_ALREADY_REMOVED_OR_NOT_FOUND",
              removed: null
            });
          } else if (that.checkCanDo(model, user,
              access.collection_delete, access.custom_delete)) {
            _model._option = {
              user: helper.getProperty(req, 'session.user') || {},
              remove: true
            };
            model.save(function (err, saved) {
              err = err || !saved ? "DOCUMENT_REMOVE_ERROR" : null;
              req.respond({
                success: !err,
                err: err,
                removed: saved
              });
            });
          } else {
            req.respond({
              success: false,
              err: "REMOVE_DOCUMENT_NOT_ALLOWED",
              removed: null
            });
          }
        });
      } else {
        req.respond({
          success: false,
          err: "DOCUMENT_ALREADY_REMOVED_OR_NOT_FOUND",
          removed: null
        });
      }
    },
    getById: function (req) {
      var that = this,
        user = helper.getProperty(req, 'session.user') || {},
        _id = helper.getProperty(req, 'data._id'),
        query;
      if (_id) {
        query = this.Model.findById(_id)
          .where({
            __removed: false
          });
        this.accessToRead(query, user);

        this.accessPopulate(query, user, helper.getProperty(req, 'data'));

        query.exec(function (err, model) {
          if (err || !model) {
            req.respond({
              success: false,
              err: "DOCUMENT_NOT_FOUND",
              model: null
            });
          } else {
            req.respond({
              success: true,
              err: null,
              model: model
            });
          }
        });
      } else {
        req.respond({
          success: false,
          err: "DOCUMENT_NOT_FOUND",
          model: null
        });
      }
    },
    // methods from collection
    count: function (req) {
      log.debug('this start proto count', this.config);
    },
    /// fetch models with queryes and permissions
    /// @param {Object} Raving request object or emulate,
    /// should have respond method for recieve the result
    /// recieved mongoose queryes errors
    fetch: function (req) {
      var that = this,
        user = helper.getProperty(req, 'session.user') || {},

        data = helper.getProperty(req, 'data'),

      // parse query and define undefined
      // TODO: release query parser
        filter = data.filter,
        page = data.page || 1,
        perpage = data.perpage || 10,
        sort = data.sort || {
          __created: -1
        },

      // make query;			
        query = this.Model.find({
          __removed: false
        });

      // TODO: release custom query (filters), populate && other options;
      this.accessToRead(query, user);

      this.useFilter(query, filter);
      // populate children documents
      this.accessPopulate(query, user, data);

      // sort result
      query.sort(sort);

      if (data.nopaginate) {
        query.exec(function (err, collection) {
          collection = collection || [];
          req.respond({
            success: !err,
            err: err,
            collection: collection,
            count: collection.length
          });
        });
      } else {
        // paginate result 
        query.paginate(page, perpage, function (err, collection, total) {
          req.respond({
            success: !err,
            err: err,
            collection: collection,
            count: total
          });
        });
      }
    },
    // TODO: condition parser
    useFilter: function (query, filter) {
      if (filter) {
        query.where(filter);
      }
      return query;
    },
    /// check permissions from update or remove document for user
    /// @param {Object} updated model
    /// @param {Object} current user
    /// @param {Object} collection permissions
    /// @param {Object} custom permissions
    /// @return {Boolean} true if user has permission for this action
    checkCanDo: function (model, user, collection, custom) {
      var diff;
      if (model.__readonly) {
        return false;
      }
      if (user._id === model.__creator) {
        return true;
      }

      if (collection) {
        if (custom.denied && custom.denied.length > 0 && model.access && model.access.length > 0) {
          diff = custom.denied.filter(function (i) {
            return (model.access.indexOf(i) > -1);
          });
          log.debug('can do', custom.denied, model.access, diff);
          return diff.length === 0;
        } else {
          return true;
        }
      } else {
        if (custom.allow && custom.allow.length > 0 && model.access && model.access.length > 0) {
          diff = custom.allow.filter(function (i) {
            return (model.access.indexOf(i) > -1);
          });
          return diff.length > 0;
        } else {
          return false;
        }
      }
    },
    /// set new values to existing document
    /// @param {Object} existing documents
    /// @param {Object} saved values
    /// @return {Object} updated document
    setNewValues: function (model, _model) {
      var key;
      // TODO: recursive setting values
      for (key in _model) {
        if (_model.hasOwnProperty(key) && key.indexOf("__") !== 0) {
          model[key] = _model[key];
        }
      }
      return model;
    },
    /// get user permissions from this collection
    /// @param {Object} current user
    /// @return {Object} permissions
    getUserAccess: function (user) {
      var access = helper.getProperty(user, 'access.' + this.config.name) || {};
      access.collection_create = this.defval(access.collection_create, true);
      access.collection_read = this.defval(access.collection_read, true);
      access.collection_update = this.defval(access.collection_update, true);
      access.collection_delete = this.defval(access.collection_delete, true);
      access.custom_update = this.defval(access.custom_update, {});
      access.custom_read = this.defval(access.custom_read, {});
      access.custom_delete = this.defval(access.custom_delete, {});
      access.custom_update.allow = this.defval(access.custom_update.allow, []);
      access.custom_update.denied = this.defval(access.custom_update.denied, []);
      access.custom_read.allow = this.defval(access.custom_read.allow, []);
      access.custom_read.denied = this.defval(access.custom_read.denied, []);
      access.custom_delete.allow = this.defval(access.custom_delete.allow, []);
      access.custom_delete.denied = this.defval(access.custom_delete.denied, []);
      log.debug('fetch', access);
      return access;
    },
    defval: function (value, def) {
      return value === undefined ? def : value;
    },
    accessUpdate: function (model, newvalues, access) {

    },
    accessToRead: function (query, user) {
      var access = this.getUserAccess(user);
      if (!access.custom_read) {
        return access.collection_read;
      }
      query.$where(function () {
        var result,
          i,
          item;
        if (!this.access) {
          return access.collection_read;
        }
        result = access.collection_read;
        for (i = 0; i < access.custom_read; i += 1) {
          item = access.custom_read[i];
          if (this.indexOf(item._id) > -1) {
            result = item.allow;
            break;
          }
        }
        return result;
      });
      return query;
    },
    /// build populate queryes with user permissions
    /// @param {Object} mongoose find query
    /// @param {Object} current user
    /// @param {Object} request data with query options
    /// @return {Object} mongoose find query
    accessPopulate: function (query, user, data) {
      var populate = data.populate || this.config.populate;
      // TODO: check access from populated documents (i`ts need?)
      query.populate(populate, null, {
        __removed: false
      });
      return query;
    }
  };
};