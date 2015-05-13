/**********************************************/
/* Email sender                               */
/* TODO: need to extend by issues             */
/**********************************************/
/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var email = require("emailjs");

module.exports = function (app) {
  "use strict";
  var config = app.get('config').core.smtp,
    log = app.get('logger')('raving.core/utils/sendmail.js'),
    server;
  if (!config) {
    return log.error('SMTP not configured');
  }
  server = email.server.connect({
    user: config.username,
    password: config.password,
    host: config.host,
    ssl: config.ssl
  });
  log.debug('init email utils');
  return function (params, cb) {
    log.debug('send email from: ', params.email);
    var message = {
      text: params.text,
      from: config.from,
      to: params.name + " <" + params.email + ">",
      subject: params.subject
/*      attachment: [
        {
          data: "<html>i <i>hope</i> this works!</html>",
          alternative: true
        },
        {
          path: "path/to/file.zip",
          type: "application/zip",
          name: "renamed.zip"
        }
           ]*/
    };

    // send the message and get a callback with an error or details of the message that was sent
    server.send(message, function (err, message) {
      log.debug('result of send email: ', err || message);
    });
  };
};


/*

details: https://github.com/eleith/emailjs
var message = {
   text:    "i hope this works", 
   from:    "you <username@your-email.com>", 
   to:      "someone <someone@your-email.com>, another <another@your-email.com>",
   cc:      "else <else@your-email.com>",
   subject: "testing emailjs",
   attachment: 
   [
      {data:"<html>i <i>hope</i> this works!</html>", alternative:true},
      {path:"path/to/file.zip", type:"application/zip", name:"renamed.zip"}
   ]
};

// send the message and get a callback with an error or details of the message that was sent
server.send(message, function(err, message) { console.log(err || message); });
*/