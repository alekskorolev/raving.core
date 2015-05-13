/*********************************************/
/*  Socket-session library                   */
/*  Release support express session in       */
/*  socket.io(web-socket) connections        */
/*********************************************/
/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var cookie = require('cookie');
module.exports = function (io, storage) {
  "use strict";
  // Prototype of session object
  var IoSession = function (session, sid) {
      session = session || {};
      session.save = function (cb) {
        if (sid) {
          return storage.set(sid, this, cb);
        }
        return cb ? cb({
          error: "it`s template session, not saved"
        }) : "it`s template session, not saved";
      };
      return session;
    },
    routes;
    // take session from storage when socket.io connection
  io.use(function (socket, next) {
    var sid,
      parsed_cookie;
    if (socket.request.headers.cookie) {
      parsed_cookie = cookie.parse(socket.request.headers.cookie);
      if (parsed_cookie['connect.sid']) {
        sid = (parsed_cookie['connect.sid'].substr(2).split('.'))[0];
        storage.get(sid, function (err, session) {
          if (err || !session) {
            socket.session = new IoSession({}, false);

            return next();
          } else {
            socket.session = new IoSession(session, sid);
            return next();
          }
        });
      } else {
        socket.session = new IoSession({}, false);
        return next();
      }
    } else {
      socket.session = new IoSession({}, false);
      return next();
    }
    next(new Error('Authentication error'));
  });

  // add route to socket connections
  routes = [];
  io.route = function (route, fn, replace) {
    if (replace) {
      replace = false;
      routes.map(function (_route) {
        if (_route.path === route) {
          _route.fn = fn;
          replace = true;
        }
      });
    }
    if (!replace) {
      routes.push({
        path: route,
        fn: fn
      });
    }
  };

  // use added routes when socket connect
  io.on('connection', function (socket) {
    routes.forEach(function (route) {
      socket.on(route.path, function (data, fn) {
        var req = {
          data: data,
          session: socket.session,
          socket: socket,
          io: io,
          respond: fn
        };
        route.fn(req);
      });
    });
  });
};