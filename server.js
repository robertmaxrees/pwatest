const Path = require('path'),
	Hapi = require('hapi'),
	jwt = require('hapi-auth-jwt2'),
	jwksRsa = require('jwks-rsa'),
	inert = require('inert'),
	wreck = require('wreck'),
	webPush = require('web-push');

const fcmEndpointURL = 'https://fcm.googleapis.com/fcm/send';

const validateUser = (decoded, request, callback) => {
	// This is a simple check that the `sub` claim
	// exists in the access token. Modify it to suit
	// the needs of your application
	if (decoded && decoded.sub) {
		return callback(null, true);
	}

	return callback(null, false);
}

webPush.setGCMAPIKey(process.env.fcmapikey);

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

server.register([inert, jwt], (err) => {
  if (err) throw err;
  server.auth.strategy('jwt', 'jwt', 'required', {
    complete: true,
    // verify the access token against the
    // remote Auth0 JWKS
    key: jwksRsa.hapiJwt2Key({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
    }),
    verifyOptions: {
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      algorithms: ['RS256']
    },
    validateFunc: validateUser
  });

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

	server.route({
		method: 'POST',
		path: '/setuserfcm',
		handler: function(request, reply) {
			const requestPayload = JSON.parse(request.payload).fcmSubscriptionData;

			request.yar.set('fcmSubscriptionData', requestPayload);

			reply(request.yar.get('fcmSubscriptionData'));
		}
	});

	server.route({
		method: 'GET',
		path: '/getuserfcm',
		handler: function(request, reply) {
			reply(request.yar.get('fcmSubscriptionData'));
		}
	});

	server.route({
		method: 'POST',
		path: '/sendfcmnotification',
		handler: function(request, reply) {
			const fcmSubscriptionData = request.yar.get('fcmSubscriptionData'),
				requestPayload = JSON.parse(request.payload);
			payloadTitle = requestPayload.title || 'GIMME A TITLE, JERK',
				payloadIcon = requestPayload.icon || '/img/192.png',
				payloadBody = requestPayload.text || 'GIMME SOME TEXT, JERK'
			payload = {
				title: payloadTitle,
				icon: payloadIcon,
				body: payloadBody
			};

			webPush.sendNotification(fcmSubscriptionData, JSON.stringify(payload))

			reply('success');
		}
	});

});

server.start((err) => {
	if (err) {
		throw err;
	}
	console.log(`Server running at: ${server.info.uri}`);
});