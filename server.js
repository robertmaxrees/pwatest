const restify = require('restify'),
	server = restify.createServer(),
	http = require('http'),
	basicResponse = function(req, res, next) {
		res.setHeader('content-type', 'text/html');
		res.write('Foo');

		res.end();
		next();
	}

http.globalAgent.maxSockets = Infinity;

server.use(restify.CORS());
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.get('/', basicResponse);
server.listen(process.env.PORT || 4000, function() {
	console.log('%s listening at %s', server.name, server.url);
});