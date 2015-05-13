/* Dublickate, need to remove */
/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
module.exports = {
  propExist: function (cntx, property) {
    "use strict";
    var key,
      exist;
    if (!cntx) {
      return false;
    }
    if (!property) {
      return true;
    }
    if (property instanceof String) {
      property = property.slice('.');
    } else {
      return false;
    }
    exist = cntx;
    for (key in property) {
      if (property.hasOwnProperty(key)) {
        exist = exist[property.key];
        if (!exist) {
          return false;
        }
      }
    }
    return true;
  },
  getProperty: function (cntx, property) {
    "use strict";
    var exist,
      key;
    if (!cntx) {
      return false;
    }
    if (!property) {
      return cntx;
    }
    if (typeof (property) === "string") {
      property = property.split('.');
    } else {
      return false;
    }
    exist = cntx;
    for (key in property) {
      if (property.hasOwnProperty(key)) {
        exist = exist[property[key]];
        if (!exist) {
          return false;
        }
      }
    }
    return exist;
  },
  hashKey: function () {
    "use strict";
    var d = new Date().getTime(),
      code = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
      });
    return code;
  }
};