/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var helpers = require('../utils/helpers');
require('angular');
module.exports = function () {
  "use strict";
  var SwitchType = function (type) {
      switch (type) {
      case "String":
        type = String;
        break;
      case "Number":
        type = Number;
        break;
      case "Date":
        type = Date;
        break;
      case "Buffer":
        type = function (value) {
          return value;
        };
        break;
      case "Boolean":
        type = Boolean;
        break;
      case "Mixed":
        type = function (value) {
          return value;
        };
        break;
      case "ObjectId":
        type = String;
        break;
      default:
        type = String;
        break;
      }
      return type;
    };
    /* ModelFactoryModule */
  angular.module('CollectionFactoryModule', ['ng', 'SocketIOModule', 'file-model', 'angularFileUpload']).
    factory(
      'CollectionFactory',
      ['$rootScope', 'socketIO', '$location', '$q', '$upload', "$timeout", "$filter",
        function ($rootScope, io, $location, $q, $upload, $timeout, $filter) {
          // collection prototype
          var cProto = {},
            mProto = {},
            Model,
            Collection;
          cProto.nav = function (opt) {
            var that = this,
              deffered = $q.defer();
            this.setState(opt);
            this.fetch().then(function (fetched) {
              that.viewport = fetched;
              deffered.resolve(fetched);
            }, function (error) {
              deffered.reject(error);
            });
            return deffered.promise;
          };
          cProto.setState = function (opt) {
            this.state = this.state || {};
            var that = this;
            this.state.page = opt.page || this.state.page || 1;
            this.state.perpage = opt.perpage || this.state.perpage || 10;
            if (this.state.filter && opt.filter) {
              angular.forEach(opt.filter, function (val, key) {
                that.state.filter[key] = val;
              });
            } else {
              this.state.filter = opt.filter || {};
            }
            this.state.search = opt.search || this.state.search;
          };
          cProto.create = function (data) {
            var model;
            if (data._id) {
              model = this.models.filter(function (model) {
                return model._id === data._id;
              })[0];
            }
            if (!model) {
              model = new this.Model(data);
              this.models.push(model);
            }
            return model;
          };
          cProto.fetch = function () {
            var that = this,
              deffered = $q.defer();
            io.send("models:" + that.name + ":fetch", that.state, function (result) {
              if (result.success) {
                that.parse(result.collection).then(function (parsed) {
                  deffered.resolve(parsed);
                }, function (err) {
                  deffered.reject(err);
                });
              } else {
                deffered.reject(result.err);
              }
            });
            return deffered.promise;
          };
          cProto.parse = function (arr) {
            var that = this,
              deffered = $q.defer(),
              parsed = [],
              mProto = {};
            if (angular.isArray(arr)) {
              angular.forEach(arr, function (data) {
                var model = that.create(data);
                parsed.push(model);
              });
              deffered.resolve(parsed);
            } else {
              deffered.reject('COLLECTION_MUST_BE_ARRAY');
            }
            return deffered.promise;
          };
            //model prototype
          mProto.save = function () {
            var that = this,
              deffered = $q.defer();
            this.validate().then(function (result) {
              io.send("models:" + that.__collection.name + ":save", that._, function (result) {
                if (result.error) {
                  return deffered.reject(result.error);
                }
                that.parse(result.saved).then(function () {
                  deffered.resolve(that);
                });
              });
            });
            return deffered.promise;
          };
          mProto.fetch = function () {
            var that = this,
              deffered = $q.defer();
            if (this._id) {
              io.send("models:" + that.__collection.name + ":get", {
                _id: this._id,
                populate: that.__collection.pattern.populate
              },
                function (result) {
                  if (result.success) {
                    that.parse(result.model).then(deffered.resolve);
                  } else {
                    deffered.reject(result.err);
                  }
                });
            }
            return deffered.promise;
          };
          mProto.validate = function () {
            // TODO: validate changed values
            var deffered = $q.defer();
            deffered.resolve();
            return deffered.promise;
          };
          mProto.parse = function (data, isNew) {
            var deffered = $q.defer(),
              that = this;
            that._ = that._ || {};
            data = data || {};
            angular.forEach(this.__collection.pattern, function (p, key) {
              var value;
              if (that.__protected.indexOf(key) > -1) {
                return;
              }
              if (that.__protected.indexOf(key) > -1) {
                return;
              }
              if (data[key] === undefined) {
                if (!isNew) {
                  return;
                }
                if (angular.isFunction(p.default)) {
                  value = p.default();
                } else if (p.default) {
                  value = new SwitchType(p.type)(p.default);
                }
                that[key] = value;
                that._[key] = value;
                return;
              }
              value = new SwitchType(p.type)(data[key]);
              if (angular.isDate(value)) {
                value.format = function (format) {
                  return $filter('date')(this, format);
                };
              }
              that[key] = value;
              that._[key] = value;
            });
            deffered.resolve(that);
            return deffered.promise;
          };
          mProto.__protected = ['save', 'validate', 'parse', '_', '__collection', '__protected'];

          Model = function (data, collection) {
            var that = this;
            that.__collection = collection;
            if (that.__collection.mExtend) {
              angular.forEach(that.__collection.mExtend, function (ext, key) {
                that[key] = ext;
              });
            }

            if (data._id && data.__v === undefined) {
              // fetch model by id
              that._id = data._id;
              that.fetch();
            } else {
              // is new
              that.parse(data, !data._id);
            }
          };
          Model.prototype = mProto;
          Collection = function (options) {
            this.pattern = options.pattern;
            this.name = options.name;
            var that = this;
            this.models = [];
            this.viewport = [];
            this.state = {
              page: 1,
              perpage: 10,
              filter: {},
              sort: {}
            };
            this.Model = function (data) {
              var model = new Model(data, that);
              return model;
            };

            if (options.cExtend) {
              angular.forEach(options.cExtend, function (ext, key) {
                that[key] = ext;
              });
            }
            this.mExtend = options.mExtend;
          };
          Collection.prototype = cProto;
          return Collection;
        }]
    );
};