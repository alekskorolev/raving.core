/*********************************************/
/*  Socket-session library                   */
/*  Release support express session in       */
/*  socket.io(web-socket) connections        */
/*********************************************/
var cookie = require('cookie');
module.exports = function (io, storage) {
	// Prototype of session object
	var ioSession = function(session, sid) {
		var session = session;
		session.save = function (cb) {
			if (sid) return storage.set(sid, this, cb);
			return cb?cb({error: "it`s template session, not saved"}):"it`s template session, not saved";
		}
		return session;
	}
	// take session from storage when socket.io connection
	io.use(function(socket, next){
    if (socket.request.headers.cookie) {
			var parsed_cookie = cookie.parse(socket.request.headers.cookie);
			if (parsed_cookie['connect.sid']) {
				var sid = (parsed_cookie['connect.sid'].substr(2).split('.'))[0];
				storage.get(sid, function(err, session) {
					if (err || !session) {
						socket.session = new ioSession({}, false);
						
						return next();
					} else {
						socket.session = new ioSession(session, sid);
						return next();
					}
				});
			} else {
				socket.session = new ioSession({}, false);
				return next();
			}
		} else {
			socket.session = new ioSession({}, false);
			return next();
		}
    next(new Error('Authentication error'));
  });
	
	// add route to socket connections
	var routes = [];
	io.route = function (route, fn, replace) {
		if (replace) {
			replace = false;
			routes.map(function(_route) {
				if (_route.path == route) {
					_route.fn = fn;
					replace = true;
				}
			});
		} 
		if (!replace) {
			routes.push({path: route, fn: fn});
		}
	}
	
	// use added routes when socket connect
	io.on('connection', function(socket) {
		routes.forEach(function(route) {
			socket.on(route.path, function (data, fn) {
				var req = {
					data: data,
					session: socket.session,
					socket: socket,
					io: io,
					respond: fn
				}
				route.fn(req);
			});
		});
	});
}