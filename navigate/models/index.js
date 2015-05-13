/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var navigats = {
  name: 'navigats',
  pattern: {
    title: {
      type: "String"
    },
    code: {
      type: "String"
    },
    link: {
      type: "String"
    },
    access: [{
      type: "ObjectId",
      ref: 'access'
    }],
    child: [{
      type: "ObjectId",
      ref: 'navigats'
    }],
    order: {
      type: "Number",
      default: 0
    }
  },
  populate: 'access child',
  access: {
    collection_create: false,
    collection_read: true,
    collection_update: false,
    collection_delete: false
  }
};
module.exports = {
  navigats: navigats
};