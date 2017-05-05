const Path = require('path'),
	Hapi = require('hapi');

const server = new Hapi.Server({
	connections: {
		routes: {
			files: {
				relativeTo: Path.join(__dirname, 'public')
			}
		}
	}
});

server.connection({
	port: process.env.PORT || 4000,
	host: '0.0.0.0'
});

server.register({
	register: require('yar'),
	options: {
		cookieOptions: {
			password: process.env.yarpass,
			isSecure: !process.env.isdev
		}
	}
}, function(err) { });

server.register(require('inert'), (err) => {
	server.route({
		method: 'GET',
		path: '/',
		handler: function(request, reply) {
			reply.file('./index.html');
		}
	});

	server.route({
		method: 'GET',
		path: '/favicon.ico',
		handler: function(request, reply) {
			reply.file('./img/favicon.ico');
		}
	});

	server.route({
		method: 'GET',
		path: '/manifest.json',
		handler: {
			file: function(request) {
				return './js/manifest.json';
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/sw.js',
		handler: {
			file: function(request) {
				return './js/sw.js';
			}
		}
	});

	server.route({
		method: 'GET',
		path: '/{assetdir}/{filename}',
		handler: {
			file: function(request) {
				return './' + request.params.assetdir + '/' + request.params.filename;
			}
		}
	});
});

server.route({
	method: 'POST',
	path: '/setuserfcm',
	handler: function(request, reply) {
		requestPayload = JSON.parse(request.payload);
		request.yar.set('fcmSubscriptionId', requestPayload.fcmSubscriptionId);

		reply(request.yar.get('fcmSubscriptionId'));
	}
});

server.route({
	method: 'GET',
	path: '/getuserfcm',
	handler: function(request, reply) {
		console.log(request.yar.get('fcmSubscriptionId'));
		reply(request.yar.get('fcmSubscriptionId'));
	}
});

server.start((err) => {
	if (err) {
		throw err;
	}
	console.log(`Server running at: ${server.info.uri}`);
});